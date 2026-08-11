# Compatibility shim for older Jekyll/Liquid on modern Ruby.
# This file is required from the Gemfile so it loads before Jekyll boots.
# Jekyll-Scholar reads bibliography files through IO.read. Cloudflare's Ruby
# build environment defaults that external encoding to US-ASCII, while this
# site's bibliography includes UTF-8 Chinese text.
Encoding.default_external = Encoding::UTF_8

module Ruby40TaintCompat
  def tainted?
    false
  end

  def taint
    self
  end

  def untaint
    self
  end
end

[Object, String, Array, Hash, NilClass, Symbol, Numeric, TrueClass, FalseClass].each do |klass|
  klass.include(Ruby40TaintCompat)
end

# Ruby 4 removed File.exists?, while Jekyll-Scholar 5.x still uses it.
File.singleton_class.alias_method(:exists?, :exist?) unless File.respond_to?(:exists?)

# Bundler evaluates the Gemfile before installing dependencies. Load and patch
# bibtex-ruby only when it is already available (during Jekyll's build step).
begin
  require 'bibtex'

  class BibTeX::Bibliography
    def each(&block)
      return to_enum unless block

      data.each(&block)
      self
    end
  end

  class BibTeX::Name
    def dup
      super
    end
  end

  class BibTeX::Entry
    def each(&block)
      return to_enum unless block

      fields.each(&block)
      self
    end

    alias each_pair each

    def convert(*filters, &block)
      block ? dup.convert!(*filters, &block) : dup.convert!(*filters)
    end
  end
rescue LoadError
  # bibtex-ruby is installed by `bundle install` before Jekyll runs.
end
