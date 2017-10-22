/**
 * Validator for matching two inputs.
 * The given attribute is the value to match the own modelValue.
 * @example
 *   <input name="passwordConfirm" type="password" ng-model="passwordConf" validate-match="newPassword">
 */
export default function validateMatch() {
  return {
    require: 'ngModel',
    scope: {
      validateMatch: '='
    },
    link: function(scope, element, attrs, ngModel) {

      scope.$watch('validateMatch', function() {
        ngModel.$validate(); // validate again when match value changes
      });

      ngModel.$validators.notMatch = function(modelValue) {
        if (!modelValue || !scope.validateMatch || ngModel.$error.minlength) {
          return true;
        }
        return modelValue === scope.validateMatch;
      };
    }
  };
};
