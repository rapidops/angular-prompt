angular.module('cgPrompt',['ui.bootstrap']);

angular.module('cgPrompt').factory('prompt',['$modal','$q',function($modal,$q){

    var prompt = function(options){

        var defaults = {
            title: '',
            message: '',
            input: false,
            label: '',
            value: '',
            values: false,
            buttons: [
                {label:'Cancel',cancel:true},
                {label:'OK',primary:true}
            ]
        };

        if (options === undefined){
            options = {};
        }

        for (var key in defaults) {
            if (options[key] === undefined) {
                options[key] = defaults[key];
            }
        }

        var defer = $q.defer();

        $modal.open({
            template:'<div><div class="modal-header"><button type="button" class="close pull-right" ng-click="$dismiss()" aria-hidden="true">×</button><h4 class="modal-title">{{options.title}}</h4></div><div class="modal-body"><p ng-if="options.message">{{options.message}}</p><form id="cgPromptForm" name="cgPromptForm" ng-if="options.input" ng-submit="submit()"><div class="form-group" ng-class="{\'has-error\':cgPromptForm.$invalid && changed}"><label for="cgPromptInput">{{options.label}}</label><input id="cgPromptInput" type="text" class="form-control"  placeholder="{{options.label}}" ng-model="input.name" required ng-change="changed=true" ng-if="!options.values || options.values.length === 0"/ autofocus="autofocus"><div class="input-group" ng-if="options.values"><input id="cgPromptInput" type="text" class="form-control" placeholder="{{options.label}}" ng-model="input.name" required ng-change="changed=true" autofocus="autofocus"/><div class="input-group-btn" dropdown><button type="button" class="btn btn-default dropdown-toggle" dropdown-toggle data-toggle="dropdown"><span class="caret"></span></button><ul class="dropdown-menu pull-right"><li ng-repeat="value in options.values"><a href="" ng-click="input.name = value">{{value}}</a></li></ul></div></div></div></form></div><div class="modal-footer"><button ng-repeat="button in options.buttons track by button.label" class="btn btn-default {{button.class}}" ng-class="{\'btn-primary\':button.primary}" ng-click="buttonClicked(button)">{{button.label}}</button></div></div>',
            controller: 'cgPromptCtrl',
            resolve: {
                options:function(){ 
                    return options; 
                }
            }
        }).result.then(function(result){
            if (options.input){
                defer.resolve(result.input);
            } else {
                defer.resolve(result.button);
            }
        }, function(){
            defer.reject();
        });

        return defer.promise;
    };

    return prompt;
	}
]);

angular.module('cgPrompt').controller('cgPromptCtrl',['$scope','options','$timeout',function($scope,options,$timeout){

    $scope.input = {name:options.value};

    $scope.options = options;

    $scope.buttonClicked = function(button){
        if (button.cancel){
            $scope.$dismiss();
            return;
        }
        if (options.input && angular.element(document.querySelector('#cgPromptForm')).scope().cgPromptForm.$invalid){
            $scope.changed = true;
            return;
        }
        $scope.$close({button:button,input:$scope.input.name});
    };

    $scope.submit = function(){
        var ok;
        angular.forEach($scope.options.buttons,function(button){
            if (button.primary){
                ok = button;
            }
        });
        if (ok){
            $scope.buttonClicked(ok);
        }
    };

    $timeout(function(){
        var elem = document.querySelector('#cgPromptInput');
        if (elem) {
            if (elem.select) {
                elem.select();
            }
            if (elem.focus) {
                elem.focus();
            }
        }
    },100);
    

}]);

