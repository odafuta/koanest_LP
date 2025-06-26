import React from 'react';
import './App.css';
import heroImage from './assets/S__8413296.jpg';
import member1Image from './assets/S__465739781.jpg';
import member2Image from './assets/S__9969679.jpg';
import member3Image from './assets/248040.jpg';
import { Twitter, Facebook, Linkedin } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800 fade-in">
            ペットにやさしい買い物で、理想の未来を育もう。
          </h1>
          <h2 className="text-xl md:text-2xl font-medium mb-8 text-gray-700 fade-in">
            無添加・ヒューマングレード商品など、ペットにやさしいものを厳選する新しいECモール
          </h2>
          <p className="text-lg md:text-xl text-gray-600 fade-in">
            KOANEST はペットの健康とブランドの想いを未来につなぐ架け橋です。
          </p>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            立ち上げメンバー
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Member 1 - 加古勇成 */}
            <div className="member-card bg-white rounded-lg shadow-lg p-6 text-center">
              <img 
                src={member1Image} 
                alt="加古勇成" 
                className="w-40 h-40 object-cover mx-auto mb-6 rounded-lg"
              />
              <h3 className="text-xl font-bold mb-2 text-gray-800">加古 勇成（CEO）</h3>
              <div className="text-sm text-gray-600 mb-4 text-left">
                <p className="font-semibold mb-2">▼経歴</p>
                <p className="mb-4">
                  兵庫県出身。中央大学法学部法律学科4年。
                  本事業アイデアの考案者。多くの起業家との関わりや、大手ビジネスコンテスト優勝の経験を活かし、本事業ではCEOを担当。法律専攻のため、本事業における法律関係の整備も行う。
                </p>
                <p className="font-semibold mb-2">▼一言</p>
                <p className="mb-4">
                  「ペットにやさしい買い物で、理想の未来を育もう。」この理念に共感してくださるあなたの買い物が、愛する命を守り、地球の明日を照らしてくれます。KOANEST は、そんな未来を確かな形に変えるために、情熱と誠意のすべてを注ぎ、日々アップデートし続けます。
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <a href="https://x.com/yuseikako?s=21&t=5J_DZPZUU7wQrKlKdWNy-A" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <Twitter className="w-6 h-6 text-blue-500" />
                </a>
                <a href="https://www.facebook.com/share/1J4K7kDYxc/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <Facebook className="w-6 h-6 text-blue-600" />
                </a>
                <a href="https://www.linkedin.com/in/yuseikako" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <Linkedin className="w-6 h-6 text-blue-700" />
                </a>
              </div>
            </div>

            {/* Member 2 - 浅田幹太 */}
            <div className="member-card bg-white rounded-lg shadow-lg p-6 text-center">
              <img 
                src={member2Image} 
                alt="浅田幹太" 
                className="w-40 h-40 object-cover mx-auto mb-6 rounded-lg"
              />
              <h3 className="text-xl font-bold mb-2 text-gray-800">浅田 幹太（COO）</h3>
              <div className="text-sm text-gray-600 mb-4 text-left">
                <p className="font-semibold mb-2">▼経歴</p>
                <p className="mb-4">
                  兵庫県出身。大阪大学経済学部4年。
                  複数のスタートアップでの新規事業立ち上げ経験を活かし、本事業ではCOOを担当。卒業後はDeloitte Tohmatsu Venture Support (DTVS) にてスタートアップ支援に従事予定。
                </p>
                <p className="font-semibold mb-2">▼一言</p>
                <p className="mb-4">
                  お客様一人ひとりの声が、私たちのサービスをより良くする原動力です。ぜひ皆様と共に、理想のサービスを形にしていきたいと願っています。
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <a href="https://x.com/kanta00_?s=21" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <Twitter className="w-6 h-6 text-blue-500" />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61566071709863" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <Facebook className="w-6 h-6 text-blue-600" />
                </a>
                <a href="https://www.linkedin.com/in/kanta-asada-780598298?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <Linkedin className="w-6 h-6 text-blue-700" />
                </a>
              </div>
            </div>

            {/* Member 3 - 小田風太 */}
            <div className="member-card bg-white rounded-lg shadow-lg p-6 text-center">
              <img 
                src={member3Image} 
                alt="小田風太" 
                className="w-40 h-40 object-cover mx-auto mb-6 rounded-lg"
              />
              <h3 className="text-xl font-bold mb-2 text-gray-800">小田 風太（CTO）</h3>
              <div className="text-sm text-gray-600 mb-4 text-left">
                <p className="font-semibold mb-2">▼経歴</p>
                <p className="mb-4">
                  静岡県出身。大阪大学基礎工学部情報科学科卒業。大阪大学大学院情報科学研究科情報システム工学専攻土屋研究室1年。
                  本事業のCTOで、システムのアーキテクチャ設計から開発運用まで担当するDevOpsエンジニア。大学でコンピュータサイエンスを専攻し、飛び級による大学院進学を経たことに続き、今後は本システムに対して本気で汗を流していきたい。
                </p>
                <p className="font-semibold mb-2">▼一言</p>
                <p className="mb-4">
                  一人でも多くの方に商品への思いを届けられるような、心を込めたサービスを運営してまいります。いただいたご意見には真摯に耳を傾け、「できない理由」ではなく「どうすればできるか」を一緒に考え、柔軟に行動していきます。
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <a href="https://x.com/ZzA9YW9xIiw2uiP" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <Twitter className="w-6 h-6 text-blue-500" />
                </a>
                <a href="https://www.linkedin.com/in/futa-oda-457793245/" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <Linkedin className="w-6 h-6 text-blue-700" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About KOANEST Section */}
      <section className="section-padding bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            KOANESTとはなにか
          </h2>
          
          <div className="space-y-12">
            {/* 理念について */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                理念である「ペットにやさしい買い物で、理想の未来を育もう。」とは。
              </h3>
              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>
                  高校時代から実家で溺愛してきた一匹の愛犬――「ずっと健康で長生きしてほしい。他の家のペットたちにも同じ幸せを届けたい。」そんな願いを胸に抱いていた代表は、大学生になったある日、動画サイトで劣悪な環境に置かれ苦しむ動物たちの映像を目にしました。「なぜうちの愛犬は幸せで、あの子たちは苦しまなければならないのか。」「もしその差が単なる "運" だとしたら、自分はその運を変えられる側の人間でありたい。」――そう強く心を揺さぶられ、動物愛護の世界に目を向けるようになります。
                </p>
                <p>
                  一方、自宅では「愛犬に少しでも体に良いものを」と、たくさんのフードやケア用品を比較・購入し続ける母の姿がありました。その献身を見つめるうち、「本当に信頼できる商品だけをまとめて比較し、簡単に買える場所があれば、愛するペットの健康を守りながら飼い主の手間も減らせるのに」と感じます。こうして生まれた発想が、ペットに優しい商品のみを集めたマーケットプレイス――KOANEST です。
                </p>
                <p>
                  KOANEST では、購入のたびに売上の一部を動物保護団体へ寄付する仕組みを整えます。つまり、飼い主が愛するペットのために "良いもの" を選ぶ行為そのものが、救いを待つ他の動物たちの未来へもつながる仕掛けです。ペットにやさしい商品を扱うのは、目の前の大切な命を守ると同時に、まだ幸運に恵まれない命を支えることでもある――それが私たちの事業が「未来」のためになる理由です。
                </p>
              </div>
            </div>

            {/* KOANEST の由来 */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                "KOANEST"の由来
              </h3>
              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>
                  サービス名 「KOANEST」 には、二重の想いを込めました。
                </p>
                <p>
                  まず Kako・Oda・Asada――立ち上げメンバー３人の頭文字であり、同時に「核（Core）」を意味する KOA が、私たちメンバーが本気で心を込めたサービスを運営していくという覚悟を示します。もう一つは、サイトを訪れるすべての飼い主もまた "KOA" の一員だという考えです。
                </p>
                <p>
                  あなたが愛するペットのために選ぶひとつひとつの〈買い物〉が、やがて地球の未来を形づくる――。その"気づき"と"行動"が折り重なり、温かな巣（NEST）のように広がっていく場所をつくりたい。そんな願いから生まれた名前が KOANEST です。
                </p>
              </div>
            </div>

            {/* 私たちの呼びかけ */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                🐾 私たちの呼びかけ
              </h3>
              <div className="text-gray-600 leading-relaxed">
                <p>
                  「買い物」これは誰もが毎日無意識に行っている、最も身近な選択行動です。その "ひとつひとつの選択" が、愛するペットの健康だけでなく、地球という大きな住処にも優しく響く――
                </p>
                <p className="mt-4">
                  そんな実感を、KOANESTで味わってほしいのです。
                </p>
              </div>
            </div>

            {/* KOANEST が提供するもの */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                KOANEST が提供するもの
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 rounded-full p-2 mt-1">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">厳選された無添加・ヒューマングレード商品</h4>
                    <p className="text-gray-600">すべての商品が、ペットの体や地球環境にやさしいものだけ。</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">コミュニティと学びの場</h4>
                    <p className="text-gray-600">飼い主同士がつながることのできる、温かなNEST。</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-full p-2 mt-1">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">買うたびに未来へ投資</h4>
                    <p className="text-gray-600">売上の一部を動物保護・環境保全団体へ寄付。"選ぶ"ことが、そのまま社会を良くするエンジンに。</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 最後にメッセージ */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                🌱最後にメッセージ
              </h3>
              <div className="text-gray-600 leading-relaxed">
                <p>
                  KOANEST は、ペットと共に生きる喜びを、地球を想う優しさへと育むマーケットプレイス。日々のショッピングが、動物たちの未来へ続く温かな私たちにとってのNEST＝この地球になる。そんな循環を、ここから一緒に創っていきましょう。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            Copyright ©2025 KOANEST Group
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

