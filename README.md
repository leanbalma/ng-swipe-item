AngularJS ngSwipeItem directive
========================
An AngularJS directive that creates swipeable list items based on the AngularJS's *$swipe* service. Actions for both *swipe-right* and *swipe-left* can be defined.

How To Install It
=============
You can install ngSwipeItem using bower:
```
bower install ng-swipe-item --save
```
Then, include the ngSwipeItem dependency on your module:
```
angular.module('myApp', ['ngSwipeItem']);
```
How To Use It
=============
```html
<!-- leftFunction.html -->
<script type="text/ng-template" id="leftFunction.html">
    <p>Delete</p>
</script>

<!-- rightFunction.html -->
<script type="text/ng-template" id="rightFunction.html">
    <p>Store</p>
</script>

<div ng-repeat="thing in awesomeThings">
  <div ng-swipe-item 
    on-left="callLeftFunction($index)"
    on-right="callRightFunction($index)"
    left-template="leftFunction.html"
    right-template="rightFunction.html"
    threshold="0.3">
    <p style="line-height: 50px; text-align: center;">{{thing}}</p>
  </div>
</div>
```
* **on-left:** Function that will be called when user swipe the item to the left.
* **on-right:** Function that will be called when user swipe the item to the right.
* **left-template:** Template that will be shown when user swipe the item to the left, beyond the threshold.
* **right-template:** Template that will be shown when user swipe the item to the right, beyond the threshold.
* **threshold:** Defines the value that will be used to show the background template and confirm the intended action. *Default value: 0.5*.

To Do
=============
* Add the "Undo" feature.

Inpired On
============
 * https://github.com/FavishInc/swipe-to-remove
 * https://github.com/winkerVSbecks/swipe-li
