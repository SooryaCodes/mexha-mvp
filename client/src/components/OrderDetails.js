"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function OrderDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kitchenAssistanceOpen, setKitchenAssistanceOpen] = useState(false);
  const [assistanceType, setAssistanceType] = useState("addition");
  const [assistanceNote, setAssistanceNote] = useState("");
  const [additionalItems, setAdditionalItems] = useState([]);
  const [condiments, setCondiments] = useState([]);
  const [requestSent, setRequestSent] = useState(false);
  
  // Common condiments that can be added to orders
  const availableCondiments = [
    { id: "c1", name: "Mayonnaise", price: "0.50" },
    { id: "c2", name: "Ketchup", price: "0.50" },
    { id: "c3", name: "Mustard", price: "0.50" },
    { id: "c4", name: "Hot Sauce", price: "0.75" },
    { id: "c5", name: "Ranch Dressing", price: "0.75" },
    { id: "c6", name: "BBQ Sauce", price: "0.75" },
    { id: "c7", name: "Soy Sauce", price: "0.50" },
    { id: "c8", name: "Honey Mustard", price: "0.75" }
  ];
  
  // Additional side dishes that can be added
  const availableSides = [
    { id: "s1", name: "French Fries", price: "3.99", image: "https://www.themealdb.com/images/media/meals/urzj1d1587670726.jpg" },
    { id: "s2", name: "Onion Rings", price: "4.49", image: "https://www.themealdb.com/images/media/meals/4wvwxi1511720068.jpg" },
    { id: "s3", name: "Side Salad", price: "3.99", image: "https://www.themealdb.com/images/media/meals/vvpprx1487325699.jpg" },
    { id: "s4", name: "Coleslaw", price: "2.99", image: "https://www.themealdb.com/images/media/meals/uwxusv1487344500.jpg" },
    { id: "s5", name: "Mashed Potatoes", price: "3.49", image: "https://www.themealdb.com/images/media/meals/sxxpst1468569714.jpg" },
    { id: "s6", name: "Rice Pilaf", price: "2.99", image: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg" }
  ];

  useEffect(() => {
    // Get order details from URL parameters
    const orderId = searchParams.get("orderId");
    const itemsJson = searchParams.get("items");
    
    if (orderId && itemsJson) {
      try {
        const items = JSON.parse(decodeURIComponent(itemsJson));
        
        // Calculate totals
        const subtotal = items.reduce(
          (total, item) => total + parseFloat(item.price) * item.quantity,
          0
        ).toFixed(2);
        
        const tax = (parseFloat(subtotal) * 0.08).toFixed(2);
        const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
        
        setOrder({
          id: orderId,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          table: "12",
          items,
          customer: {
            name: "John Doe",
            phone: "(555) 123-4567",
            email: "john.doe@example.com"
          },
          payment: {
            subtotal,
            tax,
            total
          },
          status: "preparing"
        });
      } catch (error) {
        console.error("Error parsing order items:", error);
      }
    }
    
    setLoading(false);
  }, [searchParams]);

  const toggleCondiment = (condiment) => {
    if (condiments.some(c => c.id === condiment.id)) {
      setCondiments(condiments.filter(c => c.id !== condiment.id));
    } else {
      setCondiments([...condiments, condiment]);
    }
  };

  const toggleAdditionalItem = (item) => {
    if (additionalItems.some(i => i.id === item.id)) {
      setAdditionalItems(additionalItems.filter(i => i.id !== item.id));
    } else {
      setAdditionalItems([...additionalItems, { ...item, quantity: 1 }]);
    }
  };

  const updateAdditionalItemQuantity = (id, quantity) => {
    setAdditionalItems(
      additionalItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleSendKitchenRequest = () => {
    // In a real app, you would send this to your backend
    console.log("Kitchen assistance request:", {
      orderId: order.id,
      type: assistanceType,
      note: assistanceNote,
      additionalItems,
      condiments
    });
    
    setRequestSent(true);
    
    // Reset after a few seconds
    setTimeout(() => {
      setKitchenAssistanceOpen(false);
      setRequestSent(false);
      setAssistanceNote("");
      setAdditionalItems([]);
      setCondiments([]);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-rose-500 mb-4">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">We couldn't find the order details you're looking for.</p>
          <Button 
            onClick={() => router.push("/")}
            className="bg-rose-600 hover:bg-rose-700"
          >
            Return to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Order Status Banner */}
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Order #{order.id}</h1>
              <span className="px-3 py-1 bg-white text-rose-600 rounded-full font-medium text-sm">
                {order.status === "preparing" ? "Preparing" : "Ready"}
              </span>
            </div>
            <p className="opacity-90">Thank you for your order! Your delicious food is being prepared.</p>
            
            <div className="mt-6 flex space-x-3">
              <Button 
                onClick={() => setKitchenAssistanceOpen(true)}
                className="bg-white text-rose-600 hover:bg-rose-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                  <path d="M9 18h6"></path>
                  <path d="M10 22h4"></path>
                </svg>
                Kitchen Assistance
              </Button>
              
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-rose-600"
                onClick={() => router.push("/")}
              >
                Order More
              </Button>
            </div>
          </div>
          
          {/* Order Progress */}
          <div className="bg-rose-50 p-4 border-t border-rose-200">
            <div className="relative">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-rose-200">
                <div className="w-2/3 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-rose-600"></div>
              </div>
              <div className="flex justify-between text-xs text-rose-700">
                <div className="text-center">
                  <div className="w-6 h-6 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Order Placed</span>
                </div>
                <div className="text-center">
                  <div className="w-6 h-6 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Preparing</span>
                </div>
                <div className="text-center">
                  <div className="w-6 h-6 bg-rose-200 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-rose-600 font-bold text-xs">3</span>
                  </div>
                  <span>Ready</span>
                </div>
                <div className="text-center">
                  <div className="w-6 h-6 bg-rose-200 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-rose-600 font-bold text-xs">4</span>
                  </div>
                  <span>Served</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-800">Order Details</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order Date & Time</h3>
                <p className="text-gray-800">{order.date} at {order.time}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Table Number</h3>
                <p className="text-gray-800">{order.table}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Customer</h3>
                <p className="text-gray-800">{order.customer.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Contact</h3>
                <p className="text-gray-800">{order.customer.phone}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-800">Order Items</h2>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <li key={item.idMeal} className="py-4 flex">
                  <img 
                    src={item.strMealThumb} 
                    alt={item.strMeal} 
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium text-gray-800">{item.strMeal}</h3>
                      <p className="text-gray-800 font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                    {item.tag && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">
                        {item.tag}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">${order.payment.subtotal}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="text-gray-800">${order.payment.tax}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <span className="text-lg font-medium text-gray-800">Total</span>
                <span className="text-lg font-bold text-rose-600">${order.payment.total}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Nutritional Information */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <h2 className="text-lg font-medium text-gray-800">Nutritional Information</h2>
            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">AI Generated</span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-blue-700 mb-1">Calories</h3>
                <p className="text-2xl font-bold text-blue-900">~850</p>
                <p className="text-xs text-blue-700">kcal</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-green-700 mb-1">Protein</h3>
                <p className="text-2xl font-bold text-green-900">32g</p>
                <p className="text-xs text-green-700">64% daily value</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-yellow-700 mb-1">Carbs</h3>
                <p className="text-2xl font-bold text-yellow-900">65g</p>
                <p className="text-xs text-yellow-700">25% daily value</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-red-700 mb-1">Fat</h3>
                <p className="text-2xl font-bold text-red-900">28g</p>
                <p className="text-xs text-red-700">43% daily value</p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-blue-800 mb-2">Health Insights</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-0.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-sm text-gray-700">Rich in essential amino acids from protein sources</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600 mr-2 mt-0.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span className="text-sm text-gray-700">Moderately high in sodium - consider drinking extra water</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Kitchen Assistance Dialog */}
        <Dialog open={kitchenAssistanceOpen} onOpenChange={setKitchenAssistanceOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Kitchen Assistance</DialogTitle>
              <DialogDescription>
                Need something extra with your order? Let us know and we'll help you out.
              </DialogDescription>
            </DialogHeader>
            
            {!requestSent ? (
              <>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={assistanceType === "addition" ? "default" : "outline"}
                      className={assistanceType === "addition" ? "bg-rose-600" : ""}
                      onClick={() => setAssistanceType("addition")}
                    >
                      Add to Order
                    </Button>
                    <Button
                      type="button"
                      variant={assistanceType === "assistance" ? "default" : "outline"}
                      className={assistanceType === "assistance" ? "bg-rose-600" : ""}
                      onClick={() => setAssistanceType("assistance")}
                    >
                      Request Help
                    </Button>
                  </div>
                  
                  {assistanceType === "addition" && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Add Condiments</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {availableCondiments.map(condiment => (
                            <Button
                              key={condiment.id}
                              type="button"
                              variant="outline"
                              className={`justify-start ${
                                condiments.some(c => c.id === condiment.id) 
                                  ? "border-rose-500 bg-rose-50" 
                                  : ""
                              }`}
                              onClick={() => toggleCondiment(condiment)}
                            >
                              <span className="flex items-center">
                                {condiments.some(c => c.id === condiment.id) && (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-rose-500">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                )}
                                {condiment.name} (+${condiment.price})
                              </span>
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Add Side Dishes</h3>
                        <div className="grid gap-3">
                          {availableSides.map(side => (
                            <div 
                              key={side.id}
                              className={`flex items-center p-2 border rounded-lg ${
                                additionalItems.some(i => i.id === side.id) 
                                  ? "border-rose-500 bg-rose-50" 
                                  : "border-gray-200"
                              }`}
                            >
                              <img 
                                src={side.image} 
                                alt={side.name} 
                                className="w-12 h-12 object-cover rounded-md mr-3"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800">{side.name}</h4>
                                <p className="text-rose-600">${side.price}</p>
                              </div>
                              
                              {additionalItems.some(i => i.id === side.id) ? (
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => {
                                      const item = additionalItems.find(i => i.id === side.id);
                                      if (item.quantity > 1) {
                                        updateAdditionalItemQuantity(side.id, item.quantity - 1);
                                      } else {
                                        toggleAdditionalItem(side);
                                      }
                                    }}
                                  >
                                    -
                                  </Button>
                                  <span className="w-6 text-center font-medium">
                                    {additionalItems.find(i => i.id === side.id)?.quantity || 0}
                                  </span>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => {
                                      const item = additionalItems.find(i => i.id === side.id);
                                      updateAdditionalItemQuantity(side.id, item.quantity + 1);
                                    }}
                                  >
                                    +
                                  </Button>
                                </div>
                              ) : (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-sm h-8 bg-rose-500 hover:bg-rose-600 text-white rounded-full px-4"
                                  onClick={() => toggleAdditionalItem(side)}
                                >
                                  Add
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Notes</h3>
                    <Textarea
                      placeholder="Any specific requests or details..."
                      value={assistanceNote}
                      onChange={(e) => setAssistanceNote(e.target.value)}
                      className="resize-none"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setKitchenAssistanceOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button"
                    className="bg-rose-600 hover:bg-rose-700"
                    onClick={handleSendKitchenRequest}
                    disabled={
                      assistanceType === "addition" && 
                      additionalItems.length === 0 && 
                      condiments.length === 0 && 
                      !assistanceNote
                    }
                  >
                    Send Request
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Request Sent!</h3>
                <p className="text-gray-600">
                  Your request has been sent to the kitchen. A server will assist you shortly.
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}