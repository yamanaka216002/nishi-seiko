import React, { useState, useEffect } from 'react';
import { Send, Calendar, MessageCircle, Sparkles, Key } from 'lucide-react';

const FutureSelfChat = () => {
  const [step, setStep] = useState('setup');
  const [futureYear, setFutureYear] = useState('');
  const [yearsLater, setYearsLater] = useState('');
  const [chatMode, setChatMode] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('anthropic_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const currentYear = 2025;
  const currentAge = new Date().getFullYear() - 1990; // 仮の年齢計算

  const chatModes = [
    { id: 'advice', name: 'アドバイスモード', icon: '💡', desc: '未来の自分が今の悩みにアドバイス' },
    { id: 'reflection', name: '振り返りモード', icon: '🔄', desc: '過去(今)を振り返って語る' },
    { id: 'achievement', name: '目標達成モード', icon: '🎯', desc: '夢を叶えた自分として語る' },
    { id: 'reality', name: '現実チェックモード', icon: '⚡', desc: '愛ある厳しめの助言' },
    { id: 'encouragement', name: '励ましモード', icon: '🌟', desc: 'とにかく応援してくれる' }
  ];

  const calculateFutureAge = () => {
    const targetYear = parseInt(futureYear) || (currentYear + parseInt(yearsLater));
    return currentAge + (targetYear - currentYear);
  };

  const getPersonalityTraits = (mode) => {
    const traits = {
      advice: { tone: '優しく的確', emoji: '😊💭', prefix: 'そうだね、' },
      reflection: { tone: '懐かしそうに', emoji: '😌✨', prefix: 'あの頃は、' },
      achievement: { tone: '自信に満ちて', emoji: '😄🎉', prefix: 'やったよ!', },
      reality: { tone: '愛のある厳しさ', emoji: '😤💪', prefix: 'はっきり言うけど、' },
      encouragement: { tone: '全力応援', emoji: '🌈💖', prefix: '絶対大丈夫!', }
    };
    return traits[mode];
  };

  const generateResponse = async (userMessage) => {
    setIsTyping(true);

    const targetYear = parseInt(futureYear) || (currentYear + parseInt(yearsLater));
    const futureAge = calculateFutureAge();
    const personality = getPersonalityTraits(chatMode);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const systemPrompt = `あなたは${targetYear}年の未来から来た、${futureAge}歳の自分です。
現在は${currentYear}年で、${currentAge}歳の過去の自分と話しています。
会話モード: ${chatModes.find(m => m.id === chatMode)?.name}
性格: ${personality.tone}で、${personality.emoji}のような感情表現を使います。
${personality.prefix}のような口調で始めることが多いです。

過去の自分を${chatMode === 'reality' ? '愛を持って厳しく' : '温かく'}サポートし、
具体的で心に響くアドバイスをしてください。絵文字も適度に使って感情豊かに。`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            { role: 'user', content: systemPrompt + '\n\n過去の自分からのメッセージ: ' + userMessage }
          ],
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'API Error');
      }

      const aiMessage = data.content[0].text;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiMessage,
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '😅 ごめん、ちょっと通信の調子が悪いみたい。APIキーが正しいか確認して、もう一度話しかけてくれる?',
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
      }]);
    }

    setIsTyping(false);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    generateResponse(inputMessage);
    setInputMessage('');
  };

  const startChat = () => {
    if ((!futureYear && !yearsLater) || !chatMode || !apiKey) return;

    // Save API key to localStorage
    localStorage.setItem('anthropic_api_key', apiKey);

    const targetYear = parseInt(futureYear) || (currentYear + parseInt(yearsLater));
    const futureAge = calculateFutureAge();
    const personality = getPersonalityTraits(chatMode);

    setStep('chat');
    setMessages([{
      role: 'assistant',
      content: `${personality.emoji} やあ!${targetYear}年の自分だよ。${futureAge}歳になった未来の自分が、今の君と話せて嬉しい!何でも聞いてね。`,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                未来の自分と対話
              </h1>
              <p className="text-gray-600">時空を超えて、未来のあなたからアドバイスをもらおう</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-500" />
                  Anthropic API キー
                </label>
                <input
                  type="password"
                  placeholder="sk-ant-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm"
                />
                <p className="mt-2 text-xs text-gray-500">
                  🔒 APIキーはブラウザのlocalStorageに保存されます。
                  <a
                    href="https://console.anthropic.com/settings/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline ml-1"
                  >
                    APIキーを取得する
                  </a>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  いつの未来の自分と話す?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="西暦年 (例: 2035)"
                      value={futureYear}
                      onChange={(e) => {
                        setFutureYear(e.target.value);
                        setYearsLater('');
                      }}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                      min={currentYear + 1}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="○年後"
                      value={yearsLater}
                      onChange={(e) => {
                        setYearsLater(e.target.value);
                        setFutureYear('');
                      }}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                      min={1}
                    />
                  </div>
                </div>
                {(futureYear || yearsLater) && (
                  <p className="mt-2 text-sm text-purple-600">
                    📅 {parseInt(futureYear) || (currentYear + parseInt(yearsLater))}年の{calculateFutureAge()}歳の自分
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-pink-500" />
                  会話モードを選択
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {chatModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setChatMode(mode.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        chatMode === mode.id
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{mode.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-800">{mode.name}</div>
                          <div className="text-sm text-gray-600">{mode.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startChat}
                disabled={(!futureYear && !yearsLater) || !chatMode || !apiKey}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                対話を始める ✨
              </button>
              {(!apiKey || (!futureYear && !yearsLater) || !chatMode) && (
                <p className="text-center text-sm text-gray-500">
                  {!apiKey && '⚠️ APIキーを入力してください'}
                  {apiKey && (!futureYear && !yearsLater) && '⚠️ 未来の年を設定してください'}
                  {apiKey && (futureYear || yearsLater) && !chatMode && '⚠️ 会話モードを選択してください'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        <div className="bg-white rounded-t-3xl shadow-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">
                {parseInt(futureYear) || (currentYear + parseInt(yearsLater))}年の自分
              </h2>
              <p className="text-sm text-gray-600">
                {chatModes.find(m => m.id === chatMode)?.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setStep('setup');
              setMessages([]);
              setFutureYear('');
              setYearsLater('');
              setChatMode('');
            }}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            設定に戻る
          </button>
        </div>

        <div className="flex-1 bg-white px-6 py-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-purple-100' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-b-3xl shadow-xl p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="メッセージを入力..."
              className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureSelfChat;
