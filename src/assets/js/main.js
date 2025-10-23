//Глобальный объект App сайта
var App = {
    win: $(window),
	doc: $(document),
	is_mobile: detectmob(), // браузер мобильный или нет
	ms_ie: /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent), // Браузер - ie или нет
	max_mobile_width: 992, // максимальная ширина, при которой применяется стили и функционал для портативных устройств
};


// определение мобильного браузера
function detectmob() { 
	if(navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)
	)
		{
			return true;
		}
	else {
		return false;
	}
}


App.HeaderMenu = function () {
    var class_site_menu_open = 'site--menu-open';
	$('.js--main-menu-button').on('click', function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('body').removeClass(class_site_menu_open);
        } else {
            $(this).addClass('active');
            $('body').addClass(class_site_menu_open);
        }
    });
};


App.Carousels = function () {
	$( '.carousel-cols-3' ).each(function( index ) {
		$(this).slick({
			dots: false,
			infinite: false,
			speed: 300,
			slidesToShow: 3,
			slidesToScroll: 1,
			prevArrow: $(this).data('arrow-prev'),
			nextArrow: $(this).data('arrow-next'),
			responsive: [
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 2,
						variableWidth: true
					}
				},
				{
					breakpoint: 576,
					settings: {
						slidesToShow: 1,
						variableWidth: true
					}
				}
			],
		});
	});
};


// Форма "Свяжитесь с нами" (в подвале)
App.ContactForm = function () {
    var module = function () {
        this.render();
    },
	this_;

    module.prototype = {
        el: {
			form_selector: 'form[name="CONTACT_FORM"]',
			form_response_dialog: document.getElementById('contact_form_response_dialog'),
			form_response_selector: '#contact_form_response_dialog .block__content',
			form_submit_selector: 'form[name="CONTACT_FORM"] :submit',
            // site_key: $('form[name="CONTACT_FORM"]').data("site-key"),
		},
        messages_values: {
            name: {
                required: "Пожалуйста представьтесь",
                maxlength: "Максимум 100 символов",
            },
            email: {
                required: "Укажите ваш e-mail",
                maxlength: "Максимум 100 символов",
                email: "Укажите корректный e-mail",
            },
            message: {
                required: "Введите сообщение",
                maxlength: "Максимум 4000 символов",
            },
            consent: {
                required: "Необходимо согласие"
            }
        },
        response_text: {
            success: '<p>Ваш запрос успешно отправлен</p><h2>Наши специалисты скоро свяжутся с Вами!</h2><button type="button" class="button" onclick="contact_form_response_dialog.close();">Отлично!</button>',
            error: '<h4>Ошибка отправки</h4>'
        },
		render: function () {
            this_ = this;
			this_.applicationForm();
        },
		applicationForm: function () {
			
			$(this_.el.form_selector).submit(function(event) {
				$(this_.el.form_response_selector).html("");
				event.preventDefault();
			});
            
            // update_captcha_tokens(this_.el.site_key, "recaptchaContact");
			
			$(this_.el.form_selector).validate({
				rules: {
					name: {
						required: true,
						maxlength: 100,
					},
                    email: {
                        required: true,
						maxlength: 100,
                        email: true,
					},
					phone: {
						required: false,
					},
					message: {
						required: true,
						maxlength: 4000,
					},
                    // consent: {
                    //     required: true,
                    // }
				},
				messages: this_.messages_values,
				focusInvalid: false,
				showErrors: function(errorMap, errorList) {
					if (errorList.length>0) {
						$(this_.el.form_submit_selector).prop('disabled', true);
					} else {
						$(this_.el.form_submit_selector).prop('disabled', false);
					}
					this.defaultShowErrors();
				},
				submitHandler: function(form) {
					$(this_.el.form_submit_selector).addClass('button--preloader');
					
					$.ajax({ 
						url: $(this_.el.form_selector).attr('action'),
						type: 'POST',
						dataType: "json",
						cache: false,
						data: $(form).serialize(),
						success: function (data) {
							if (data.success == true) {
								$(this_.el.form_response_selector).html(this_.response_text.success);
                                $(this_.el.form_selector)[0].reset();
							}
							else {
								$(this_.el.form_response_selector).html(this_.response_text.error);
								console.log(data.ErrorInfo);
							}
						},
						error: function (data) {
							$(this_.el.form_response_selector).html(this_.response_text.success);
							if (data.hasOwnProperty("responseJSON")) {
								$(this_.el.form_response_selector).append(data.responseJSON.message);
								console.log("error: " + data.responseJSON.message);
							} else {
								$(this_.el.form_response_selector).append('Ошибка status: ' + data.status + ', statusText: ' + data.statusText);
								console.log(data.responseText);
							}
						},
						complete: function () {
							this_.el.form_response_dialog.showModal();
							$(this_.el.form_submit_selector).prop('disabled', false).removeClass('button--preloader');

                            // update_captcha_tokens(this_.el.site_key, "recaptchaContact");
						},
					});
					
				}
			});
			
		},
    };
    new module;
};


// function update_captcha_tokens(site_key, input_id) {
// 	grecaptcha.ready(function () {
//         grecaptcha.execute(site_key, { action: 'contact' }).then(function (token) {
//             var recaptchaResponse = document.getElementById(input_id);
//             recaptchaResponse.value = token;
//         });
//     });
// };


App.PhoneMasks = function () {
	$('input[name="phone"]').mask('+7 (000) 0000000');
};


$(document).ready(function(){
	App.HeaderMenu();
	App.Carousels();
	App.ContactForm();
	App.PhoneMasks();
});
