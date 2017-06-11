module Makepure
  module Sass
    class << self
      def load!
        if defined?(::Rails)
          register_rails_engine
        elsif defined?(::Sprockets)
          register_sprockets
        end

        configure_sass
      end

      def gem_path
        @gem_path ||= File.expand_path('..', File.dirname(__FILE__))
      end

      def stylesheets_path
        File.join(gem_path, 'assets/stylesheets')
      end

      private

      def configure_sass
        require 'sass'

        ::Sass.load_paths << stylesheets_path
      end

      def register_rails_engine
        require 'makepure/sass/engine'
      end

      def register_sprockets
        Sprockets.append_path(stylesheets_path)
      end
    end
  end
end

Makepure::Sass.load!