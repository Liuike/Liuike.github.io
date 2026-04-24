# Compatibility shim for older Jekyll/Liquid on modern Ruby.
# Ruby 3.2+ removed taint support, but Liquid 4 still calls these methods.
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
