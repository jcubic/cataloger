angular.module('app').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('pl_PL', {"categories":"kategorie","pages":"strony","products":"produkty","logout":"wyloguj","username":"użytkownik","password":"hasło","login":"zaloguj","save":"zapisz","old password":"stare hasło","new password":"nowe hasło","confirm password":"potwierdź hasło","settings":"ustawienia","passwords do not match":"hasła nie pasują do siebie","title":"tytuł","new page":"nowa strona"});
    gettextCatalog.setStrings('pl_PL', {"categories":"kategorie","products":"produkty"});
/* jshint +W100 */
}]);