'use strict';

/**
 * @description
 * A swipeable item that could be fully customizable. User can define action for both swipe-left and swipe-right.
 * Inspired by:
 * - https://github.com/FavishInc/swipe-to-remove
 * - https://github.com/winkerVSbecks/swipe-li
 *
 **/
angular.module('ngSwipeItem',['ngTouch'])
  .directive('ngSwipeItem', ['$swipe','$timeout', function ($swipe, $timeout) {
    return {
      restrict: 'A',
      transclude: true,
      scope: {
        onLeft: '&',
        onRight: '&',
        threshold: '@',
        leftTemplate: '@',
        rightTemplate: '@'
      },
      template: '<div style="position:relative">' +
                  '<ng-include ng-style="leftTemplateStyle" ng-show="showLeftTemplate" src="leftTemplate"></ng-include>' +
                  '<ng-include ng-style="rightTemplateStyle" ng-show="showRightTemplate" src="rightTemplate"></ng-include>' +
                  '<div class="swiper-content">' +
                     '<div ng-transclude></div>' +
                  '</div>' +
                '</div>',
      link: function postLink(scope, element, attrs) {

        scope.leftTemplate = attrs.leftTemplate;
        scope.rightTemplate = attrs.rightTemplate;

        scope.leftTemplateStyle = {
          'position': 'absolute'
        };

        scope.rightTemplateStyle = {
          'position': 'absolute',
          'right': '0px'
        };

        var swiperContent = angular.element('.swiper-content', element);

        // threshold is 0.5 by default.
        var threshold = scope.threshold || 0.5;

        swiperContent.css({
          'position': 'relative',
          'cursor': 'pointer',
        });

        swiperContent.parent().css({
          'overflow': 'hidden'
        });


        function applyTransition(apply) {
          var transitionProperty = {};
          var transitionValue = 'all 0.3s';
          var transitionEmptyValue = '';
          if(apply) {
            transitionProperty = {
              'transition': transitionValue,
              '-o-transition': transitionValue,
              '-moz-transition': transitionValue,
              '-ms-transition': transitionValue,
              '-khtml-transition': transitionValue,
              '-webkit-transition': transitionValue,
            };
          }
          else {
            transitionProperty = {
              'transition': transitionEmptyValue,
              '-o-transition': transitionEmptyValue,
              '-moz-transition': transitionEmptyValue,
              '-ms-transition': transitionEmptyValue,
              '-khtml-transition': transitionEmptyValue,
              '-webkit-transition': transitionEmptyValue,
            };
          }

          return transitionProperty;
        }


        /* Sets the opacity of the element.
         * 'positionDifference' is the difference between the initial position
         * and the current position.
         * If 'positionDifference' -> 0 ; opacity -> 1
         * If 'positionDifference' -> element width ; opacity -> 0
         */
        function setElementOpacity(positionDifference) {
          positionDifference = Math.abs(positionDifference);
          var elementWidth = swiperContent.width();
          // console.log('element width: ' + elementWidth);
          var opacity = -(positionDifference) / elementWidth + 1;
          swiperContent.css('opacity', opacity);
        }


        /* Brings the element back to the origin.
         */
        function returnToOrigin() {
          swiperContent.css('left', 0);
          swiperContent.css(applyTransition(true));
          setElementOpacity(0);
        }


        /* Removes the element from the list and call
         * either the onRight function or the onLeft function.
         */
        function removeFromList(finalDistance) {
          var elementWidth = element.width();
          swiperContent.css('opacity', 0);
          swiperContent.css(applyTransition(true));
          if(finalDistance > 0) {
            // The element is swiped to the right.
            swiperContent.css('left', elementWidth);
            $timeout(function() {
              scope.onRight();
            }, 300);
          }
          else {
            // The element is swiped to the left.
            swiperContent.css('left', -elementWidth);
            $timeout(function() {
              scope.onLeft();
            }, 300);
          }
        }

        // More info about AngularJS $swipe service: https://docs.angularjs.org/api/ngTouch/service/$swipe
        var initialCoord_x;
        $swipe.bind(swiperContent, {
          start: function(initialCoords) {
            initialCoord_x = initialCoords.x;
            // Remove transition temporarily.
            swiperContent.css(applyTransition(false));
          },

          move: function(currentPosition) {
            var currentCoord_x = currentPosition.x;
            setElementOpacity(currentCoord_x - initialCoord_x);
            swiperContent.css('left', currentCoord_x - initialCoord_x);

            // If current position is higher than the threshold, then show the
            // background template.
            var elementWidth = swiperContent.width();
            if( Math.abs(currentCoord_x - initialCoord_x) > (elementWidth * threshold)) {
              if(initialCoord_x > currentCoord_x) {
                scope.showRightTemplate = true;
              }
              else {
                scope.showLeftTemplate = true;
              }
            }
            else {
              scope.showLeftTemplate = false;
              scope.showRightTemplate = false;
            }

            // Update the view.
            scope.$apply();
          },

          end: function(finalCoords) {
            // If the final distance is bigger than the threshold,
            // then remove the element from the list. Else, return
            // the element to the origin.
            var finalDistance_x = finalCoords.x - initialCoord_x;
            var elementWidth = swiperContent.width();
            if(Math.abs(finalDistance_x) > elementWidth * threshold) {
              removeFromList(finalDistance_x);
            }
            else {
              returnToOrigin();
            }

            // Update the view.
            scope.$apply();
          },

          cancel: function(event) {
            returnToOrigin();
            scope.$apply();
          }
        });

      }

    };
  }]);
