require 'spec_helper'

RSpec.describe 'Sass compilation' do
  it 'compiles scss to css' do
    path = 'assets/stylesheets'
    file = 'rpure'
    sass_engine = Sass::Engine.for_file(
                    "#{path}/#{file}.scss",
                    cache_location: 'tmp/.sass-cache',
                    load_paths:     [path],
                    syntax:         :scss
                  )
    expect {
      File.open("#{file}.css", 'w') { |f| f.write(sass_engine.render) }
    }.not_to raise_error
  end
end
