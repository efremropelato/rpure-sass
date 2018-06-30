+function ($) {
    'use strict';
    var RpureModal = function (element, options) {
        this.options = options;
        this.$body = $(document.body);
        this.$element = $(element);
        this.$backdrop =
            this.isShown = null;
        this.scrollbarWidth = 0;

        if (this.options.remote) {
            this.$element
                .find('.rpuremodal-content')
                .load(this.options.remote, $.proxy(function () {
                    this.$element.trigger('loaded.bs.rpuremodal')
                }, this))
        }
    };

    RpureModal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    };

    RpureModal.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
    };

    RpureModal.prototype.show = function (_relatedTarget) {
        var that = this;
        var e = $.Event('show.bs.rpuremodal', {relatedTarget: _relatedTarget});

        this.$element.trigger(e);

        if (this.isShown || e.isDefaultPrevented()) return;

        this.isShown = true;

        this.checkScrollbar();
        this.$body.addClass('rpuremodal-open');

        this.setScrollbar();
        this.escape();

        this.$element.on('click.dismiss.bs.rpuremodal', '[data-dismiss="rpuremodal"]', $.proxy(this.hide, this));

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade');

            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body)
            }

            that.$element
                .show()
                .scrollTop(0);

            if (transition) {
                that.$element[0].offsetWidth
            }

            that.$element
                .addClass('in')
                .attr('aria-hidden', false);

            that.enforceFocus();

            var e = $.Event('shown.bs.rpuremodal', {relatedTarget: _relatedTarget});

            transition ?
                that.$element.find('.rpuremodal-dialog') // wait for rpuremodal to slide in
                    .one('bsTransitionEnd', function () {
                        that.$element.trigger('focus').trigger(e)
                    })
                    .emulateTransitionEnd(300) :
                that.$element.trigger('focus').trigger(e)
        })
    };

    RpureModal.prototype.hide = function (e) {
        if (e) e.preventDefault();

        e = $.Event('hide.bs.rpuremodal');

        this.$element.trigger(e);

        if (!this.isShown || e.isDefaultPrevented()) return;

        this.isShown = false;

        this.$body.removeClass('rpuremodal-open');

        this.resetScrollbar();
        this.escape();

        $(document).off('focusin.bs.rpuremodal');

        this.$element
            .removeClass('in')
            .attr('aria-hidden', true)
            .off('click.dismiss.bs.rpuremodal');

        $.support.transition && this.$element.hasClass('fade') ?
            this.$element
                .one('bsTransitionEnd', $.proxy(this.hideRpureModal, this))
                .emulateTransitionEnd(300) :
            this.hideRpureModal()
    }

    RpureModal.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.bs.rpuremodal') // guard against infinite focus loop
            .on('focusin.bs.rpuremodal', $.proxy(function (e) {
                if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                    this.$element.trigger('focus')
                }
            }, this))
    }

    RpureModal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.rpuremodal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.rpuremodal')
        }
    }

    RpureModal.prototype.hideRpureModal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.$element.trigger('hidden.bs.rpuremodal')
        })
    }

    RpureModal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null
    }

    RpureModal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : '';

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate;

            this.$backdrop = $('<div class="rpuremodal-backdrop ' + animate + '" />')
                .appendTo(this.$body)

            this.$element.on('click.dismiss.bs.rpuremodal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return;
                this.options.backdrop == 'static'
                    ? this.$element[0].focus.call(this.$element[0])
                    : this.hide.call(this)
            }, this));

            if (doAnimate) this.$backdrop[0].offsetWidth

            this.$backdrop.addClass('in');

            if (!callback) return;

            doAnimate ?
                this.$backdrop
                    .one('bsTransitionEnd', callback)
                    .emulateTransitionEnd(150) :
                callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in');

            var callbackRemove = function () {
                that.removeBackdrop();
                callback && callback()
            };
            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop
                    .one('bsTransitionEnd', callbackRemove)
                    .emulateTransitionEnd(150) :
                callbackRemove()

        } else if (callback) {
            callback()
        }
    };

    RpureModal.prototype.checkScrollbar = function () {
        if (document.body.clientWidth >= window.innerWidth) return;
        this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar()
    };

    RpureModal.prototype.setScrollbar = function () {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
        if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
    };

    RpureModal.prototype.resetScrollbar = function () {
        this.$body.css('padding-right', '')
    };

    RpureModal.prototype.measureScrollbar = function () {
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'rpuremodal-scrollbar-measure';
        this.$body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.$body[0].removeChild(scrollDiv);
        return scrollbarWidth
    }

    function Plugin(option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.rpuremodal');
            var options = $.extend({}, RpureModal.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('bs.rpuremodal', (data = new RpureModal(this, options)));
            if (typeof option == 'string') data[option](_relatedTarget);
            else if (options.show) data.show(_relatedTarget)
        })
    }

    var old = $.fn.rpuremodal;

    $.fn.rpuremodal = Plugin;
    $.fn.rpuremodal.Constructor = RpureModal;

    $.fn.rpuremodal.noConflict = function () {
        $.fn.rpuremodal = old;
        return this
    };

    $(document).on('click.bs.rpuremodal.data-api', '[data-toggle="rpuremodal"]', function (e) {
        var $this = $(this);
        var href = $this.attr('href');
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); // strip for ie7
        var option = $target.data('bs.rpuremodal') ? 'toggle' : $.extend({remote: !/#/.test(href) && href}, $target.data(), $this.data());

        if ($this.is('a')) e.preventDefault();

        $target.one('show.bs.rpuremodal', function (showEvent) {
            if (showEvent.isDefaultPrevented()) return; // only register focus restorer if rpuremodal will actually get shown
            $target.one('hidden.bs.rpuremodal', function () {
                $this.is(':visible') && $this.trigger('focus')
            })
        });
        Plugin.call($target, option, this)
    });

    $(".rpuremodal-wide").on("show.bs.rpuremodal", function () {
        var height = $(window).height() - 200;
        $(this).find(".rpuremodal-body").css("max-height", height);
    });

}(jQuery);
