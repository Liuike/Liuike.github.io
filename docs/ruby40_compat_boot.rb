# Compatibility shim for older Jekyll/Liquid on modern Ruby.
# This file is required from the Gemfile so it loads before Jekyll boots.
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

# Jekyll-Scholar 5.x is the newest release compatible with this site's
# GitHub Pages/Jekyll 3 deployment. These two patches account for Ruby 4's
# changed block and String#dup behaviour in its older bibtex-ruby dependency.
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
