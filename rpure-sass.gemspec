# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'rpure/sass/version'

Gem::Specification.new do |spec|
  spec.name          = 'rpure-sass'
  spec.version       = Rpure::Sass::VERSION
  spec.authors       = ['Efrem Ropelato']
  spec.email         = ['efrem.ropelato@gmail.com']

  spec.summary       = 'Sass framework Pure.CSS based and ready to use in Ruby projects'
  spec.description   = 'Sass framework Pure.CSS based and ready to use in Ruby projects'
  spec.homepage      = "https://efremropelato.github.io/rpure-sass/"
  spec.license       = 'MIT'

  spec.files         = `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  spec.bindir        = 'exe'
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ['lib']

  spec.required_ruby_version = '>= 2.0.0'

  spec.add_runtime_dependency 'sass', '>= 3.4'

  spec.add_development_dependency 'railties', '>= 5.0'
  spec.add_development_dependency 'rspec', '>= 3.5'
  spec.add_development_dependency 'sprockets-rails', '>= 3.0'
end
