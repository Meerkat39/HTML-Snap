/**
 * アプリ全体のヘッダーコンポーネント
 * タイトルを表示するだけのシンプルなUI
 */
const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-8 py-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold">📸 HTML Snap</h1>
    </header>
  );
};

export default Header;
