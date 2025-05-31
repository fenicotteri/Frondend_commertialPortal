const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Коммер</h3>
            <p className="text-gray-300">
              Платформа для бизнеса: делитесь событиями, акциями и скидками.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white">Главная</a></li>
              <li><a href="/businesses" className="text-gray-300 hover:text-white">Бизнесы</a></li>
              <li><a href="/create-post" className="text-gray-300 hover:text-white">Создать публикацию</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <p className="text-gray-300">
              Email: info@commer.com<br />
              Телефон: +7 (952) 123-4567
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Коммер. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
