import { useState } from 'react';
import { FiPlus, FiTrash2, FiPrinter, FiDownload, FiDollarSign } from 'react-icons/fi';

const BillingForm = () => {
    const [items, setItems] = useState([
        { id: 1, desc: 'Consultation Fee', price: 50.00 },
        { id: 2, desc: 'Lab Test: Blood Count', price: 120.00 },
    ]);

    const addItem = () => {
        setItems([...items, { id: Date.now(), desc: '', price: 0 }]);
    };

    const removeItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    const subtotal = items.reduce((acc, current) => acc + (parseFloat(current.price) || 0), 0);
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Create New Bill</h2>
                    <p className="text-gray-500 font-medium italic">Generate automated invoices with GST calculations.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                        <FiDownload className="text-gray-600" />
                    </button>
                    <button className="btn-primary flex items-center space-x-2">
                        <FiPrinter />
                        <span>Save & Print</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Billing Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-8 bg-white shadow-xl min-h-[500px]">
                        <div className="flex items-center justify-between mb-8 border-b pb-4">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bill Particulars</span>
                            <button onClick={addItem} className="flex items-center space-x-1 text-primary-600 font-bold hover:underline">
                                <FiPlus />
                                <span>Add row</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div key={item.id} className="flex items-center space-x-4 animate-slide-in">
                                    <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400">0{index + 1}</span>
                                    <input
                                        type="text"
                                        placeholder="Enter service description..."
                                        className="flex-1 p-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-primary-500 font-medium"
                                        value={item.desc}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].desc = e.target.value;
                                            setItems(newItems);
                                        }}
                                    />
                                    <div className="relative">
                                        <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="w-28 pl-8 pr-4 py-3 border border-gray-100 rounded-xl outline-none focus:border-primary-500 font-bold text-primary-600"
                                            value={item.price}
                                            onChange={(e) => {
                                                const newItems = [...items];
                                                newItems[index].price = e.target.value;
                                                setItems(newItems);
                                            }}
                                        />
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary Panel */}
                <div className="space-y-6">
                    <div className="card p-8 bg-gray-900 text-white shadow-2xl h-fit">
                        <h3 className="text-lg font-bold mb-8 opacity-70 border-b border-white/10 pb-4">Payment Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between font-medium opacity-80">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-medium opacity-80">
                                <span>Tax (GST 18%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-medium opacity-80">
                                <span>Discount</span>
                                <span className="text-green-400">-$0.00</span>
                            </div>
                            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-bold opacity-50 uppercase mb-1">Total Payable</p>
                                    <p className="text-4xl font-bold">${total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-8 bg-white text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-xl">Finalize Payment</button>
                    </div>

                    <div className="card p-6 bg-primary-50 border-2 border-primary-100">
                        <h4 className="font-bold text-gray-900 mb-2">Patient Details</h4>
                        <p className="text-sm font-semibold text-gray-500">John Doe (P-1023)</p>
                        <p className="text-sm font-semibold text-gray-500 mb-4">Male • 28 Years</p>
                        <button className="text-xs font-bold text-primary-600 uppercase tracking-widest hover:underline">Change Patient</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingForm;
