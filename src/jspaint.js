(function ($) {
    "use strict";

    var CONSTANTS = {
        canvasId: "jspaint-canvas",
        canvasContainerId: "jspaint-paint-area",
        activeToolCursorClass: "working-with-tools",
        maintoolsClass: "main-tool",
        basicColors:
          [
            { hex: '00FFFF', name: "Aqua" },
            { hex: '000000', name: "Black" },
            { hex: '0000FF', name: "Blue" },
            { hex: 'FF00FF', name: "Fuchsia" },
            { hex: '808080', name: "Gray" },
            { hex: '008000', name: "Green" },
            { hex: '00FF00', name: "Lime" },
            { hex: '800000', name: "Maroon" },
            { hex: '000080', name: "Navy" },
            { hex: '808000', name: "Olive" },
            { hex: '800080', name: "Purple" },
            { hex: 'FF0000', name: "Red" },
            { hex: 'C0C0C0', name: "Silver" },
            { hex: '008080', name: "Teal" },
            { hex: 'FFFFFF', name: "White" },
            { hex: 'FFFF00', name: "Yellow" },
          ],
        Events: {
            mousemove: 'mousemove',
            mouseclick: 'click'
        }
    };

    var
    size = window.location.toString().split('?')[1].split('=')[1],
    sizeX = size.split('x')[0],
    sizeY = size.split('x')[1],
    jspaint = null,
    selectedAlternativeColor = '',
    selectedPrimaryColor = '',
    resetCanvasColor = 'white',
    context = null;

    var Actions = {
        Mouse: {
            getX: function (options) {
                var event = options.event,
                    relativeTo = options.relativeTo,
                    X = event.pageX - relativeTo.offset().left;

                return X;
            },
            getY: function (options) {
                var event = options.event,
                    relativeTo = options.relativeTo,
                    Y = event.pageY - relativeTo.offset().top;

                return Y;
            }
        }
    };

    $(function () {
        var CANVASAPI = {
            fillCirc: function (x, y, radius) {
                context.beginPath();
                context.arc(x, y, radius, 0, 2 * Math.PI, false);
                context.fill();
            }
        };
        var Color = {
            generateBasicColorPalette: function (options) {
                var IContainBasicColors = options.appendHere || '.BasicColorPalette',
                    div1 = $('<div></div>'),
                    div2 = $('<div></div>'),
                    row = div1,
                    hex = null,
                    color = null,
                    colors = options.basicColors || CONSTANTS.basicColors,
                    len = colors.length,
                    i = 0;

                for (i = 0; i < len; i++) {
                    row = i < len / 2 ? div1 : div2;
                    hex = '#' + colors[i].hex;
                    color = $('<div></div>')
                                .addClass('color')
                                .attr('id', 'Color-Hex-' + hex)
                                .css('background-color', hex);
                    color.appendTo(row);
                }
                div1.appendTo(IContainBasicColors);
                div2.appendTo(IContainBasicColors);
            }
        };
        var Tools = {
            SpeedDot: {
                CONSTANTS: {
                    id: 'SpeedDotTool', selectionId: '#SpeedDotTool', class: 'main-tool'
                },
                VARIABLES: {
                    width: 2,
                    height: 2
                },
                start: function (options) {
                    var event = options.event || CONSTANTS.Events.mousemove,
                        canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                        mouseOptions = null;

                    $(canvasId).on(event, function (e) {
                        mouseOptions = { event: e, relativeTo: $(this) };
                        context.fillRect(
                            Actions.Mouse.getX(mouseOptions),
                            Actions.Mouse.getY(mouseOptions),
                            Tools.SpeedDot.VARIABLES.width,
                            Tools.SpeedDot.VARIABLES.height);
                    });
                },
                stop: function (options) {
                    var event = options.event || CONSTANTS.Events.mousemove,
                        canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

                    $(canvasId).off(event);
                },
                Events: {
                    register: function (options) {
                        var toolId = options.toolId || CONSTANTS.Tools.SpeedDot.selectionId,
                            tool = $(toolId);

                        options.tool = tool;

                        tool.funcToggle('click',
                          function () {
                              activateTool(options);
                              activeTool = tool;
                          },
                          function () {
                              activeTool = null;
                              deactivateTool(options);
                          }
                        );
                    }
                }
            },
            Square: {
                CONSTANTS: {
                    id: 'SquareTool', selectionId: '#SquareTool', class: 'main-tool'
                },
                VARIABLES: {
                    side: 10
                },
                start: function (options) {
                    var event = options.event || CONSTANTS.Events.mouseclick,
                                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                                mouseOptions = null;

                    $(canvasId).on(event, function (e) {
                        mouseOptions = { event: e, relativeTo: $(this) };
                        context.fillRect(
                            Actions.Mouse.getX(mouseOptions),
                            Actions.Mouse.getY(mouseOptions),
                            Tools.Square.VARIABLES.side,
                            Tools.Square.VARIABLES.side
                        );
                    });
                },
                stop: function (options) {
                    var event = options.event || CONSTANTS.Events.mouseclick,
                                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);
                    $(canvasId).off(event);
                },
                Events: {
                    register: function (options) {
                        var toolId = options.toolId || CONSTANTS.Tools.Square.selectionId,
                                          tool = $(toolId);

                        options.tool = tool;

                        tool.funcToggle('click', function () {
                            activateTool(options);
                            activeTool = tool;
                        },
                      function () {
                          activeTool = null;
                          deactivateTool(options);
                      });
                    }
                }
            },
            Disc: {
                CONSTANTS: {
                    id: 'DiscTool', selectionId: '#DiscTool', class: 'main-tool'
                },
                VARIABLES: { radius: 10 },
                start: function (options) {
                    var event = options.event || CONSTANTS.Events.mouseclick,
                                  canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                                  mouseOptions = null;

                    $(canvasId).on(event, function (e) {
                        mouseOptions = { event: e, relativeTo: $(this) };
                        CANVASAPI.fillCirc(Actions.Mouse.getX(mouseOptions), Actions.Mouse.getY(mouseOptions), Tools.Disc.VARIABLES.radius);
                    });
                },
                stop: function (options) {
                    var event = options.event || CONSTANTS.Events.mouseclick,
                                 canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

                    $(canvasId).off(event);
                },
                ContextMenu: {
                    activate: function (options) {
                        var div = $('<div></div>').attr('id', options.id).addClass('menu-item');
                        var increase = $('<div></div>').attr('id', options.increaseDiscSize.id).addClass('menu-item');
                        var increaseIcon = $('<i></i>').addClass(options.increaseDiscSize.icon);
                        var anchorIncrease = $('<a></a>').css('font-size', '20px').on('click', function () {
                            Tools.Disc.VARIABLES.radius += 2;
                            $(this).attr('title', Tools.Disc.VARIABLES.radius);
                        });
                        increaseIcon.appendTo(anchorIncrease);
                        anchorIncrease.appendTo(increase);
                        var decrease = $('<div></div>').attr('id', options.decreaseDiscSize.id).addClass('menu-item');
                        var decreaseIcon = $('<i></i>').addClass(options.decreaseDiscSize.icon);
                        var anchorDecrease = $('<a></a>').css('font-size', '20px').on('click', function () {
                            Tools.Disc.VARIABLES.radius = Tools.Disc.VARIABLES.radius - 2 === 0 ? 2 : Tools.Disc.VARIABLES.radius - 2;
                            $(this).attr('title', Tools.Disc.VARIABLES.radius);
                        });
                        decreaseIcon.appendTo(anchorDecrease);
                        anchorDecrease.appendTo(decrease);
                        increase.appendTo(div);
                        decrease.appendTo(div);
                        div.appendTo($(options.containerSelectionCriterion));
                    },
                    deactivate: function (options) {
                        $('#' + options.id).remove();
                    },
                    getOptions: function () {
                        return {
                            tool: this,
                            id: 'DiscContextMenu',
                            increaseDiscSize: {
                                id: 'increaseDiscSize',
                                icon: 'glyphicon glyphicon-circle-arrow-up',
                                containerId: 'DiscContextMenu'
                            },
                            decreaseDiscSize: {
                                id: 'decreaseDiscSize',
                                icon: 'glyphicon glyphicon-circle-arrow-down',
                                containerId: 'DiscContextMenu'
                            },
                            containerSelectionCriterion: '.contextual-tool-bar'
                        };
                    }
                },
                Events: {
                    register: function (options) {
                        var toolId = options.toolId || CONSTANTS.Tools.Disc.selectionId,
                                     tool = $(toolId),
                                     contextMenu = Tools.Disc.ContextMenu;

                        options.tool = tool;

                        tool.funcToggle('click',
                          function () {
                              activateTool(options);
                              contextMenu.activate(contextMenu.getOptions());
                              activeTool = tool;
                          },
                          function () {
                              activeTool = null;
                              deactivateTool(options);
                              contextMenu.deactivate(contextMenu.getOptions());
                          }
                        );
                    }
                }
            },
            Pencil: {
                CONSTANTS: {
                    id: "PencilTool", selectionId: '#PencilTool', class: 'main-tool'
                },
                VARIABLES: {
                    width: 2,
                    height: 2
                },
                start: function (options) {
                    var event = options.event || CONSTANTS.Events.mousemove,
                    canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                    mouseOptions = null;

                    $(canvasId).on(event, function (e) {
                        mouseOptions = { event: e, relativeTo: $(this) };
                        if (e.buttons !== undefined) {
                            if (e.buttons === 1) {
                                context.fillRect(
                                    Actions.Mouse.getX(mouseOptions),
                                    Actions.Mouse.getY(mouseOptions),
                                    Tools.Pencil.VARIABLES.width,
                                    Tools.Pencil.VARIABLES.height
                                );
                            }
                        }
                    });
                },
                stop: function (options) {
                    var event = options.event || CONSTANTS.Events.mousemove,
                    canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

                    $(canvasId).off(event);
                },
                ContextMenu: {
                    activate: function (options) {
                        var div = $('<div></div>').attr('id', options.id).addClass('menu-item');
                        var increase = $('<div></div>').attr('id', options.increaseDotSize.id).addClass('menu-item');
                        var increaseIcon = $('<i></i>').addClass(options.increaseDotSize.icon);
                        var anchorIncrease = $('<a></a>').css('font-size', '20px').on('click', function () {
                            Tools.Pencil.VARIABLES.width += 2;
                            Tools.Pencil.VARIABLES.height = Tools.Pencil.VARIABLES.width;
                            $(this).attr('title', Tools.Pencil.VARIABLES.width);
                        });
                        increaseIcon.appendTo(anchorIncrease);
                        anchorIncrease.appendTo(increase);
                        var decrease = $('<div></div>').attr('id', options.decreaseDotSize.id).addClass('menu-item');
                        var decreaseIcon = $('<i></i>').addClass(options.decreaseDotSize.icon);
                        var anchorDecrease = $('<a></a>').css('font-size', '20px').on('click', function () {
                            Tools.Pencil.VARIABLES.width = Tools.Pencil.VARIABLES.width - 2 === 0 ? 2 : Tools.Pencil.VARIABLES.width - 2;
                            Tools.Pencil.VARIABLES.height = Tools.Pencil.VARIABLES.width;
                            $(this).attr('title', Tools.Pencil.VARIABLES.width);
                        });
                        decreaseIcon.appendTo(anchorDecrease);
                        anchorDecrease.appendTo(decrease);
                        increase.appendTo(div);
                        decrease.appendTo(div);
                        div.appendTo($(options.containerSelectionCriterion));
                    },
                    deactivate: function (options) {
                        $('#' + options.id).remove();
                    },
                    getOptions: function () {
                        return {
                            tool: this,
                            id: 'PencilContextMenu',
                            increaseDotSize: {
                                id: 'increaseDotSize',
                                icon: 'glyphicon glyphicon-circle-arrow-up',
                                containerId: 'PencilContextMenu'
                            },
                            decreaseDotSize: {
                                id: 'decreaseDotSize',
                                icon: 'glyphicon glyphicon-circle-arrow-down',
                                containerId: 'PencilContextMenu'
                            },
                            containerSelectionCriterion: '.contextual-tool-bar'
                        };
                    }
                },
                Events: {
                    register: function (options) {
                        var toolId = options.toolId || Tools.Pencil.CONSTANTS.selectionId,
                            tool = $(toolId),
                            contextMenu = Tools.Pencil.ContextMenu;

                        options.tool = tool;

                        tool.funcToggle('click',
                          function () {
                              activateTool(options);
                              contextMenu.activate(contextMenu.getOptions());
                              activeTool = $(this);
                          },
                          function () {
                              activeTool = null;
                              deactivateTool(options);
                              contextMenu.deactivate(contextMenu.getOptions());
                          }
                        );
                    }
                }
            }
        };
        var

      initializeCanvas = function (options) {
          var canvas = $('<canvas/>', { id: options.canvasId })
              .prop({ 'width': options.width, 'height': options.height })
              .appendTo('#' + options.canvasContainerId);
          return canvas[0];
      },

      initializeContext = function (options) {
          var sizeX = options.sizeX || 600,
              sizeY = options.sizeY || 400,
              width = sizeX - 2,
              height = sizeY - 2,
              canvasId = options.canvasId || CONSTANTS.canvasId,
              canvasContainerId = options.canvasContainerId || CONSTANTS.containerId,
              canvas = initializeCanvas({ canvasId: canvasId, width: width, height: height, canvasContainerId: canvasContainerId });

          return canvas.getContext('2d');
      },



          generateHexColorStringFromThisElementsId = function (element) {
              return '#' + element.attr('id').split('#')[1];
          },



          activateTool = function (options, start) {
              if (activeTool !== null) {
                  activeTool.trigger('click');
              }
              $(options.tool).toggleClass('active-tool');
              options.start(options);
          },

          deactivateTool = function (options, stop) {
              $(options.tool).toggleClass('active-tool');
              options.stop(options);
          },

          activeTool = null,




          registerColorEvents = function () {
              $('.color')
                .on('click', function () {
                    selectedPrimaryColor = context.fillStyle = generateHexColorStringFromThisElementsId($(this));
                })
                .on('contextmenu', function () {
                    selectedAlternativeColor = generateHexColorStringFromThisElementsId($(this));
                });
          },

          registerAllColorsPickerEvents = function (options) {
              $('#' + options.containerId + ' #' + options.toolId).on('input', function () {
                  selectedPrimaryColor = context.fillStyle = $(this).val();
              });
          },

          registerSaveImageEvents = function (options) {
              $('#' + options.toolId).on('click', function () {
                  window.open($('#' + CONSTANTS.canvasId)[0].toDataURL("image/png"), "_blank");
              });
          },
          registerResetCanvasEvents = function (options) {
              $('#' + options.toolId).on('click', function () {
                  var canvas = $('#' + CONSTANTS.canvasId)[0];
                  var canvasHeight = canvas.height;
                  var canvasWidth = canvas.width;
                  var context = canvas.getContext('2d');
                  context.save();
                  context.transform(1, 0, 0, 1, 0, 0);
                  context.fillStyle = resetCanvasColor;

                  context.fillRect(0, 0, canvasWidth, canvasHeight);
                  context.restore();
              });
          },


          registerEvents = function () {
              registerColorEvents();
              Tools.Pencil.Events.register({
                  toolId: Tools.Pencil.CONSTANTS.selectionId,
                  event: CONSTANTS.Events.mousemove,
                  canvasId: CONSTANTS.canvasId,
                  start: Tools.Pencil.start,
                  stop: Tools.Pencil.stop
              });
              Tools.Disc.Events.register({
                  toolId: Tools.Disc.CONSTANTS.selectionId,
                  event: CONSTANTS.Events.mouseclick,
                  canvasId: CONSTANTS.canvasId,
                  start: Tools.Disc.start,
                  stop: Tools.Disc.stop
              });
              Tools.SpeedDot.Events.register({
                  toolId: Tools.SpeedDot.CONSTANTS.selectionId,
                  event: CONSTANTS.Events.mousemove,
                  canvasId: CONSTANTS.canvasId,
                  start: Tools.SpeedDot.start,
                  stop: Tools.SpeedDot.stop
              });
              Tools.Square.Events.register({
                  toolId: Tools.Square.CONSTANTS.selectionId,
                  containerId: 'jspaint-tools',
                  event: CONSTANTS.Events.mouseclick,
                  canvasId: CONSTANTS.canvasId,
                  start: Tools.Square.start,
                  stop: Tools.Square.stop
              });
              registerAllColorsPickerEvents({ toolId: 'allColorsPicker', containerId: 'HTML5ColorPicker' });
              registerSaveImageEvents({ toolId: 'save-as-image', containerId: 'SaveImageButton' });
              registerResetCanvasEvents({ toolId: 'reset-canvas', containerId: 'ResetCanvas' });

          },

          mustAssignDimensionsToCanvasContainer = function () {
              $('#jspaint-paint-area').css({
                  width: sizeX, height: sizeY
              });
          },

          initializeToolsInfo = function () {
              $('.' + CONSTANTS.maintoolsClass).attr('title', 'Click to activate;\nRight-click to deactivate;');
          },

          initializeTopTakerWidget = function () {
              $('.top-taker').TopTaker({ 'theme': 'dark' });
          },

          init = function () {
              mustAssignDimensionsToCanvasContainer();
              context = initializeContext({ sizeX: sizeX, sizeY: sizeY, canvasId: CONSTANTS.canvasId, canvasContainerId: CONSTANTS.canvasContainerId });
              initializeToolsInfo();
              initializeTopTakerWidget();
              Color.generateBasicColorPalette({ appendHere: '.BasicColorPalette', basicColors: CONSTANTS.basicColors });
              registerEvents();
              $('#PencilTool').trigger('click');
          },
          tests = function () {
              if (window.location.href.startsWith("file://")) {
                  mocha.setup('bdd');
                  mocha.reporter('html');
                  var assert = chai.assert;

                  var runEventTest = function (options) {
                      describe("Events are installed properly for " + options.name, function () {
                          var tool = $(options.selectionCriterion);
                          var events = $._data(tool[0], "events");
                          it("There is exactly one event.", function () {
                              assert(1, events.length);
                          });
                          it("There is exactly one click event.", function () {
                              assert(events.click !== "undefined");
                          });
                      });
                  },

                  checkingForInstalledEvents = function () {
                      runEventTest({ name: Tools.Pencil.CONSTANTS.id, selectionCriterion: Tools.Pencil.CONSTANTS.selectionId });
                      runEventTest({ name: Tools.SpeedDot.CONSTANTS.id, selectionCriterion: Tools.SpeedDot.CONSTANTS.selectionId });
                      runEventTest({ name: Tools.Square.CONSTANTS.id, selectionCriterion: Tools.Square.CONSTANTS.selectionId });
                      runEventTest({ name: Tools.Square.CONSTANTS.id, selectionCriterion: Tools.Square.CONSTANTS.selectionId });
                      runEventTest({
                          name: Tools.Disc.CONSTANTS.id, selectionCriterion: Tools.Disc.CONSTANTS.selectionId
                      });
                      runEventTest({ name: "Reset Canvas", selectionCriterion: '#reset-canvas' });
                      runEventTest({ name: "Save Image", selectionCriterion: '#save-as-image' });
                      runEventTest({ name: "Color Picker", selectionCriterion: '#allColorsPicker' });

                      runEventTest({ name: "Basic colors", selectionCriterion: '.color' });
                  };
                  describe('Testing.', function () {
                      checkingForInstalledEvents();
                  });
              }
              if (navigator.userAgent.indexOf('PhantomJS') < 0) {
                  mocha.run();
              }
          },
          mustRunInSequence = function () {
              init();
              tests();
          };
        mustRunInSequence();
    });
})(jQuery);