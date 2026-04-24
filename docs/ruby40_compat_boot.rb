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
