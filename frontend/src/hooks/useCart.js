import { useMemo, useState } from 'react'

export function useCart() {
  const [items, setItems] = useState([])

  const addItem = (product, quantity = 1) => {
    const sanitizedQuantity = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1
    setItems((previous) => {
      const existing = previous.find((item) => item.id === product.id)
      if (existing) {
        return previous.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + sanitizedQuantity, Math.max(1, product.stockQuantity ?? 1)),
              }
            : item,
        )
      }

      return [
        ...previous,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stockQuantity: product.stockQuantity ?? 0,
          quantity: Math.min(sanitizedQuantity, Math.max(1, product.stockQuantity ?? 1)),
        },
      ]
    })
  }

  const removeItem = (productId) => {
    setItems((previous) => previous.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    setItems((previous) =>
      previous.map((item) => {
        if (item.id !== productId) {
          return item
        }
        const max = Math.max(1, item.stockQuantity ?? 1)
        return { ...item, quantity: Math.max(1, Math.min(quantity, max)) }
      }),
    )
  }

  const clearCart = () => setItems([])

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return {
      subtotal,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    }
  }, [items])

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal: totals.subtotal,
    itemCount: totals.itemCount,
    totalQuantity: totals.itemCount,
    clear: clearCart,
  }
}
