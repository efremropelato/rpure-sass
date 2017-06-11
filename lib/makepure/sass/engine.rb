module Makepure
  module Sass
    module Rails
      class Engine < ::Rails::Engine
        initializer 'makepure-sass.assets.precompile' do |app|
          app.config.assets.paths << root.join('assets/stylesheets').to_s
          app.config.assets.paths << root.join('assets/javascripts').to_s
          app.config.assets.paths << root.join('assets/fonts').to_s
        end
      end
    end
  end
end