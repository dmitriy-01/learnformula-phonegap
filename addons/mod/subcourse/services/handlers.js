// Copyright (C) 2017 Mike Churchward <mike.churchward@poetgroup.org>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('mm.addons.mod_subcourse')

/**
 * Mod Subcourse handler.
 *
 * @module mm.addons.mod_subcourse
 * @ngdoc service
 * @name $mmaModSubcourseHandlers
 */
    .factory('$mmaModSubcourseHandlers', function ($mmCourse, $mmaModSubcourse, $state, $q, $log, $mmUtil) {
        var self = {};
        $log = $log.getInstance('$mmaModSubcourse');

        /**
         * Course content handler.
         *
         * @module mm.addons.mod_subcourse
         * @ngdoc method
         * @name $mmaModSubcourseHandlers#courseContent
         */
        self.courseContent = function () {
            var self = {};

            /**
             * Whether or not the module is enabled for the site.
             *
             * @return {Boolean}
             */
            self.isEnabled = function () {
                return true;
            };

            /**
             * Get the controller.
             *
             * @param {Object} module The module info.
             * @param {Number} courseid The course ID.
             * @return {Function}
             */
            self.getController = function (module, courseId) {
                return function ($scope) {
                    $scope.title = module.name;
                    $scope.icon = 'addons/mod/subcourse/icon.svg'
                    $scope.class = 'mma-mod_subcourse-handler';
                    // $log.debug('module', module);
                    $mmaModSubcourse.getRefCourse(module.instance).then(function (response) {
                        $log.debug('response', response);
                        $scope.action = function () {
                            $log.debug('Redirecting to course ' + response.refcourse);
                            $state.go('redirect', {
                                state: 'site.mm_course',
                                params: {
                                    courseid: response.refcourse
                                }
                            });
                        };
                    }).catch(function (error) {
                        $log.error(error);
                        $mmUtil.showErrorModalDefault(error, 'mm.course.errorgetmodule', true);
                        return $q.reject();
                    }).finally(function () {
                        $scope.loaded = true;
                        $scope.refreshIcon = 'ion-refresh';
                    });


                    // // Get contents.
                    // $scope.spinner = true;
                    // $mmCourse.getModule(module.id, courseId, false, true).then(function (mod) {
                    //     // $log.debug(JSON.stringify(module));
                    //     $log.debug(JSON.stringify(mod));
                    //     // if (module.contents && module.contents[0] && module.contents[0].fileurl) {
                    //     //     $scope.buttons = [{
                    //     //         icon: 'ion-link',
                    //     //         label: 'mm.core.openinbrowser',
                    //     //         action: function(e) {
                    //     //             if (e) {
                    //     //                 e.preventDefault();
                    //     //                 e.stopPropagation();
                    //     //             }
                    //     //             $mmaModUrl.logView(module.instance).then(function() {
                    //     //                 $mmCourse.checkModuleCompletion(courseId, module.completionstatus);
                    //     //             });
                    //     //             $mmaModUrl.open(module.contents[0].fileurl);
                    //     //         }
                    //     //     }];
                    //     // }
                    // }).finally(function () {
                    //     $scope.spinner = false;
                    // });

                };
            };

            return self;
        };

        return self;
    });
