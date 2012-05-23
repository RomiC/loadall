(function($) {
	// Тело плагина
	$.fn.loadall = function(options) {
		// Объект с настройками
		var settings = $.extend({
			// Скорость анимации
			animation: 450,
			// Анимированная картинка загрузчика
			image: null,
			// Цвет фона загрузчика
			backgroundColor: null,
			// Callback-функция, вызываемая по окончанию загрузки
			callback: null,
			// Выводить отладочную информарцию в консоль
			debug: false
		}, options);
		
		// Включаем/выключаем отладку
		dbg.debug = settings.debug;
		
		// Объект-состояние
		var state = {
			content: "", // Загруженное содержимое блока
			sourcesNum: 0 // Кол-во загружаемых изображений
		}
		
		// Обязательно возвращаем сам объект, чтобы можно было в последствии применять к нему другие методы jQuery
		return this.each(function() {
			// Объект-контейнер, в который будем грузить содержимое
			var obj = $(this);
			// Добавляем объекту загрузчик
			$.extend(obj, {"_loader": $.extend(true, {}, loader)});
			obj._loader.init({container: obj, animation: settings.animation, image: settings.image, backgroundColor: settings.backgroundColor});
			// Запускаем процесс
			obj._loader.show(function() {
				// Запрос контента
				$.ajax({
					url: settings.url,
					dataType: "html",
					success: function(data) {
						state.content = data;
						$("*", data).each(function () {
							if ($(this).attr("src")) {
								// Увлеичиваем счетчик загружаемых объектов
								state.sourcesNum++;
								// Добавляем колбэк на загрузку картинок
								$(this).load(function() {
									dbg.out("%s loaded...", $(this).attr("src"));
									state.sourcesNum--;
									dbg.out("images left to load: %d", state.sourcesNum);
									// Если все загружено, то закроем загрузчик
									if (state.sourcesNum == 0) {
										obj._loader.hide(settings.callback);
										obj.html(state.content);
										dbg.out("everything loaded!");
									}
								});
							}
						});
						dbg.out("sources to load: %d", state.sourcesNum);
					},
					// Обработчик ошибок — информация об ошибки выводится в консоль
					error: function(jqXHR, status, error) {
						obj._loader.hide(function() { alert('error...'); dbg.out("%s: %s", status, error);})
					}
				});
			});
		});
	}
	
	// Вспомогательный функционал
	// Визуальный загрузчик — див, который будет перекрывать контейнер во время загрузки в него содержимого
	var loader = {
		// ID дива-загрузчика
		id: 0,
		// Скорость анимации — скрытия/показывания блока загрузчика
		animation: 400,
		// jQuery-объект контейнер, в который будем загружать содержимое
		container: null,
		// Визуальаня часть загрузчика
		obj: $("<div>").css({
			"background-position": "center center",
			"background-repeat": "no-repeat",
			display: "none",
			position: "absolute",
			"z-index": 100
		}),
		/**
		* Метод инициализации загрузчика
		* @param {object} settings Объект с настройками:
		* container — jQuery-объект контейнер, в который будем грузить содержимое
		* animation — скорость анимации
		* image — имя файла загрузчика
		* @this {loader}
		*/
		init: function (settings) {
			var l = this;
			l.id = "loader"+ Math.floor(Math.random()* 1000);
			l.container = settings.container;
			
			l.obj.attr("id", l.id).css({
				height: l.container.outerHeight() +"px",
				left: l.container.offset().left +"px",
				top: l.container.offset().top +"px",
				width: l.container.outerWidth() +"px",
			}).appendTo("body");

			// Устанавливаем фоновое изображение, если таковое было задано
			if (settings.backgroundColor)
				l.obj.css({"background-color": settings.backgroundColor});

			if (settings.image) {
				l.obj.css({"background-image": "url('"+ settings.image +"')"});
				$("<img>").attr("src", settings.image); // Предварительная загрузка картинки
			} else {
			// Если картинка не задана, то добавим в наш загрузчик div с надписью «loading...»
				$("<div>").text("loading...").css({
					position: "relative",
					"text-align": "center",
					top: Math.floor(l.container.height() / 2) +"px",
					width: "100%"
				}).appendTo(l.obj);
			}
			
			if (settings.animation)
				l.animation = settings.animation;
		},
		/**
		* Метод, показывающий загрузчик на экране
		* @param {function} callback Функция, вызываемая после показа загрузчика
		*/
		show: function(callback) {
			var l = this;
			l.obj.fadeIn(l.animation, function() {if (callback) callback.call(null)});
		},
		/**
		* Метод для скрытия загрузчика
		* @param {function} callback Функция вызываемая после скрытия блока
		*/
		hide: function(callback) {
			var l = this;
			l.obj.fadeOut(l.animation, function() {
				if (callback)
					callback.call();
			});
		}
	}
	
	// Отладчик
	var dbg = {
		// Флаг, определяющий выводить или нет отладочную информацию
		debug: false,
		/**
		* Единственный метод выводящий инфу в консоль, если таковая присутствует
		*/
		out: function() {
			if (this.debug && window.console && typeof window.console.log == "function")
				window.console.log.apply(window.console, arguments);
		}
	}
})(jQuery);