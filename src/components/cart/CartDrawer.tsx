import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const { items, isCartOpen, setCartOpen, removeItem, updateQuantity, clearCart } = useCartStore();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-[#1a8a4a]/10 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-[#1a8a4a]" />
                </div>
                <div>
                  <h2 className="font-bold text-[#1a1a1a]">Your Cart</h2>
                  <p className="text-xs text-gray-500">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="h-8 w-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="h-9 w-9 text-gray-300" />
                  </div>
                  <p className="font-semibold text-[#1a1a1a] mb-1">Your cart is empty</p>
                  <p className="text-sm text-gray-500 mb-5">Add some products to get started</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="bg-[#1a8a4a] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#157a3f] transition-colors"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={item.img || 'https://via.placeholder.com/100'}
                        alt={item.model}
                        className="w-16 h-16 object-cover rounded-xl bg-white border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-[#1a1a1a] line-clamp-1">{item.model}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{item.name}</p>
                        <p className="text-sm font-bold text-[#1a8a4a] mt-1">৳{item.price.toLocaleString()}</p>

                        {/* Qty controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                              className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-[#1a1a1a]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-xs font-bold text-[#1a1a1a]">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="h-7 w-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-5 space-y-4 bg-white">
                {/* Subtotal */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-medium text-[#1a1a1a]">৳{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className="text-[#1a8a4a] font-medium">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2 mt-2">
                    <span className="text-[#1a1a1a]">Total</span>
                    <span className="text-[#1a8a4a] text-lg font-black">৳{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Link
                    to="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-[#1a8a4a] hover:bg-[#157a3f] text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                  >
                    Checkout <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={clearCart}
                    className="w-full text-sm text-gray-500 hover:text-red-500 py-2 transition-colors font-medium"
                  >
                    Clear cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
