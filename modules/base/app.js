var Config = {
    server:'http://msuat.pkufi.com/bdfz_server',
    debug:true,
    key:'ed26d4cd99aa11e5b8a4c89cdc776729',
    random:(''+Math.random()).substr(2)
};
// create app module
var app = angular.module('app',['ionic', 'oc.lazyLoad', 'app.route', 'ngCordova', 'ionic-native-transitions','utils']);
// create and config route module
angular.module('app.route',[]).config(['$urlRouterProvider','$ocLazyLoadProvider','$httpProvider',
  function($urlRouterProvider, $ocLazyLoadProvider, $httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $urlRouterProvider.otherwise('/home');
    $ocLazyLoadProvider.config({
        modules:[{
            name:'mobiscroll',
            files:[
                'bower_components/mobiscroll/css/mobiscroll.custom-3.0.0-beta6.min.css',
                'bower_components/mobiscroll/js/mobiscroll.custom-3.0.0-beta6.min.js'
            ]
        },{
            name:'rating',
            files:[
                'bower_components/ionic-rating/ionic-rating.css',
                'bower_components/ionic-rating/ionic-rating.min.js'
            ]
        },{
            name:'mfb-menu',
            files:[
                'bower_components/ng-material-floating-button/mfb/dist/mfb.min.css',
                'bower_components/ng-material-floating-button/src/mfb-directive.js'
            ]
        },{
            name:'echarts',
            files:[
                'bower_components/echarts/build/dist/echarts-all.js',
                'modules/base/directives/echarts.js'
            ]
        },{
            name:'patternLock',
            files:[
                'bower_components/patternLock/patternLock.css',
                'bower_components/patternLock/patternLock.min.js',
                'modules/base/directives/patternLock.js'
            ]
        },{
            name:'animate',
            files:[
                'styles/animate.min.css'
            ]
        }]
    });
}]);

app.config(['$ionicConfigProvider','$ionicNativeTransitionsProvider',function($ionicConfigProvider,$ionicNativeTransitionsProvider){
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.views.maxCache(5);
    $ionicConfigProvider.views.forwardCache(true);
    $ionicConfigProvider.form.checkbox('circle');
    $ionicConfigProvider.form.toggle('large');
    $ionicConfigProvider.spinner.icon('bubbles');

    $ionicNativeTransitionsProvider.setDefaultOptions({
        duration: 300, // in milliseconds (ms), default 400,
        slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
        iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
        androiddelay: -1, // same as above but for Android, default -1
        winphonedelay: -1, // same as above but for Windows Phone, default -1,
        fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
        fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
        triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
        backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
    });

    $ionicNativeTransitionsProvider.setDefaultTransition({
        type: 'slide',
        direction:'left'
    });

    $ionicNativeTransitionsProvider.setDefaultBackTransition({
        type: 'slide',
        direction:'right'
    });
}])
.controller('rootController',['$rootScope','$scope','utils',function($rootScope,$scope,utils){
    $rootScope.vo = {
        ready:true
    };
    $rootScope.toggleMenu = function(menu) {
        if ($rootScope.isMenuShown(menu)) {
            $rootScope.shownMenu = null;
        } else {
            $rootScope.shownMenu = menu;
        }
    };
    $rootScope.isMenuShown = function(menu) {
        return $rootScope.shownMenu === menu;
    };
    $rootScope.menus=[{
        name:'菜单1',
        menus:[{
            name:'首页',
            state:'home',
            icon:'fa fa-home fa-fw'
        },{
            name:'通讯录',
            state:'contacts',
            icon:'fa fa-book fa-fw'
        },{
            name:'动态列表',
            state:'list',
            icon:'fa fa-bars fa-fw'
        },{
            name:'动态图表',
            state:'chart',
            icon:'fa fa-bar-chart fa-fw'
        },{
            name:'表单',
            state:'form',
            icon:'fa fa-list-alt fa-fw'
        },{
            name:'选项卡',
            state:'tab',
            icon:'fa fa-folder-o fa-fw'
        },{
            name:'登录',
            state:'login',
            icon:'fa fa-lock fa-fw'
        },{
            name:'加载图标',
            state:'loading',
            icon:'fa fa-spinner fa-pulse fa-fw'
        }]
      },{
        name:'菜单2',
        menus:[{
            name:'首页',
            state:'home',
            icon:'fa fa-home fa-fw'
          },{
            name:'通讯录',
            state:'contacts',
            icon:'fa fa-book fa-fw'
        }]
    }];

    $rootScope.server = Config.server;

    utils.$timeout(function(){
        $rootScope.screenWidth = window.screen.availWidth;
        $rootScope.screenHeight = window.screen.availHeight;
        utils.$ionicSideMenuDelegate.$getByHandle('menuHandle').canDragContent(false);
    });

    $rootScope.go = function(state,params){
        if(state==-1){
            utils.$ionicHistory.goBack();
        }else if(typeof state == 'string' && state.substr(0,1)=='#'){
            utils.$location.path(state.substr(1));
        }else{
            utils.$state.go(state,params);
        }
    };

    $rootScope.logout = function(){
        utils.cache.put('session','');
        utils.$state.go('login');
    };

    var safeState = [
        'home','login','demo'
    ];

    $rootScope.$on('$stateChangeSuccess',function(event, toState,toParams, fromState,fromParams) {
        $rootScope.state = toState;
        if(utils.$ionicSideMenuDelegate.isOpenLeft()){
            utils.$ionicSideMenuDelegate.toggleLeft(false);
        }
    });

    $rootScope.showPatternLock = function(flag){
        $rootScope.patternLockFlag = flag;
        utils.$ionicModal.fromTemplateUrl('modules/sample/views/patternLock.html',{
            scope: $rootScope,
            animation:'slide-in-up'
        }).then(function(modal){
            modal.show();
            $rootScope.modalHeight = $('.modal').height();
            $rootScope.hidePatternLock = function(){
                modal.hide();
            };
            $rootScope.patternLockModal = modal;
        });
    };

    $scope.ready = (function(){
        utils.$ocLazyLoad.load([
            'mobiscroll',
            'rating',
            'mfb-menu',
            'echarts',
            'patternLock',
            'animate'
        ]).then(function () {
          console.log('loading success!');
          $rootScope.init = 1;
        });

    })();
}]);
