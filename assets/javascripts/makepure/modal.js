+function ($) {
    'use strict';
    var MakeModal = function (element, options) {
        this.options = options;
        this.$body = $(document.body);
        this.$element = $(element);
        this.$backdrop =
            this.isShown = null;
        this.scrollbarWidth = 0;

        if (this.options.remote) {
            this.$element
                .find('.makemodal-content')
                .load(this.options.remote, $.proxy(function () {
                    this.$element.trigger('loaded.bs.makemodal')
                }, this))
        }
    };

    MakeModal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    };

    MakeModal.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
    };

    MakeModal.prototype.show = function (_relatedTarget) {
        var that = this;
        var e = $.Event('show.bs.makemodal', {relatedTarget: _relatedTarget});

        this.$element.trigger(e);

        if (this.isShown || e.isDefaultPrevented()) return;

        this.isShown = true;

        this.checkScrollbar();
        this.$body.addClass('makemodal-open');

        this.setScrollbar();
        this.escape();

        this.$element.on('click.dismiss.bs.makemodal', '[data-dismiss="makemodal"]', $.proxy(this.hide, this));

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

            var e = $.Event('shown.bs.makemodal', {relatedTarget: _relatedTarget});

            transition ?
                that.$element.find('.makemodal-dialog') // wait for makemodal to slide in
                    .one('bsTransitionEnd', function () {
                        that.$element.trigger('focus').trigger(e)
                    })
                    .emulateTransitionEnd(300) :
                that.$element.trigger('focus').trigger(e)
        })
    };

    MakeModal.prototype.hide = function (e) {
        if (e) e.preventDefault();

        e = $.Event('hide.bs.makemodal');

        this.$element.trigger(e);

        if (!this.isShown || e.isDefaultPrevented()) return;

        this.isShown = false;

        this.$body.removeClass('makemodal-open');

        this.resetScrollbar();
        this.escape();

        $(document).off('focusin.bs.makemodal');

        this.$element
            .removeClass('in')
            .attr('aria-hidden', true)
            .off('click.dismiss.bs.makemodal');

        $.support.transition && this.$element.hasClass('fade') ?
            this.$element
                .one('bsTransitionEnd', $.proxy(this.hideMakeModal, this))
                .emulateTransitionEnd(300) :
            this.hideMakeModal()
    }

    MakeModal.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.bs.makemodal') // guard against infinite focus loop
            .on('focusin.bs.makemodal', $.proxy(function (e) {
                if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                    this.$element.trigger('focus')
                }
            }, this))
    }

    MakeModal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.makemodal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.makemodal')
        }
    }

    MakeModal.prototype.hideMakeModal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.$element.trigger('hidden.bs.makemodal')
        })
    }

    MakeModal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null
    }

    MakeModal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : '';

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate;

            this.$backdrop = $('<div class="makemodal-backdrop ' + animate + '" />')
                .appendTo(this.$body)

            this.$element.on('click.dismiss.bs.makemodal', $.proxy(function (e) {
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

    MakeModal.prototype.checkScrollbar = function () {
        if (document.body.clientWidth >= window.innerWidth) return;
        this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar()
    };

    MakeModal.prototype.setScrollbar = function () {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
        if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
    };

    MakeModal.prototype.resetScrollbar = function () {
        this.$body.css('padding-right', '')
    };

    MakeModal.prototype.measureScrollbar = function () {
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'makemodal-scrollbar-measure';
        this.$body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.$body[0].removeChild(scrollDiv);
        return scrollbarWidth
    }

    function Plugin(option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.makemodal');
            var options = $.extend({}, MakeModal.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('bs.makemodal', (data = new MakeModal(this, options)));
            if (typeof option == 'string') data[option](_relatedTarget);
            else if (options.show) data.show(_relatedTarget)
        })
    }

    var old = $.fn.makemodal;

    $.fn.makemodal = Plugin;
    $.fn.makemodal.Constructor = MakeModal;

    $.fn.makemodal.noConflict = function () {
        $.fn.makemodal = old;
        return this
    };

    $(document).on('click.bs.makemodal.data-api', '[data-toggle="makemodal"]', function (e) {
        var $this = $(this);
        var href = $this.attr('href');
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); // strip for ie7
        var option = $target.data('bs.makemodal') ? 'toggle' : $.extend({remote: !/#/.test(href) && href}, $target.data(), $this.data());

        if ($this.is('a')) e.preventDefault();

        $target.one('show.bs.makemodal', function (showEvent) {
            if (showEvent.isDefaultPrevented()) return; // only register focus restorer if makemodal will actually get shown
            $target.one('hidden.bs.makemodal', function () {
                $this.is(':visible') && $this.trigger('focus')
            })
        });
        Plugin.call($target, option, this)
    });

    $(".makemodal-wide").on("show.bs.makemodal", function () {
        var height = $(window).height() - 200;
        $(this).find(".makemodal-body").css("max-height", height);
    });

}(jQuery);
