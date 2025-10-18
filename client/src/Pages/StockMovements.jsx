import { useState, useEffect } from 'react';
import { stockMovementsAPI, productsAPI } from '../services/api';
import { formatDate } from '../lib/utils';
import Button from '../components/ui/Button';

export default function StockMovements() {
  const [stockMovements, setStockMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    movementType: 'IN',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movementsRes, productsRes] = await Promise.all([
          stockMovementsAPI.getAll(),
          productsAPI.getAll()
        ]);
        
        setStockMovements(movementsRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      productId: '',
      quantity: '',
      movementType: 'IN',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const movementData = {
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
        movementType: formData.movementType,
        notes: formData.notes
      };
      
      const response = await stockMovementsAPI.create(movementData);
      setStockMovements([...stockMovements, response.data]);
      
      // Update the product quantity in the products list
      const updatedProduct = products.find(p => p.id === movementData.productId);
      if (updatedProduct) {
        const newQuantity = formData.movementType === 'IN' 
          ? updatedProduct.quantity + movementData.quantity
          : updatedProduct.quantity - movementData.quantity;
        
        setProducts(products.map(p => 
          p.id === movementData.productId 
            ? { ...p, quantity: newQuantity } 
            : p
        ));
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error creating stock movement:', error);
      alert('Failed to create stock movement. Please try again.');
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getMovementTypeClass = (type) => {
    return type === 'IN' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Stock Movements</h1>
        <Button onClick={handleOpenModal}>Add Movement</Button>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stockMovements.map((movement) => (
              <tr key={movement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(movement.date)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {getProductName(movement.productId)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMovementTypeClass(movement.movementType)}`}>
                    {movement.movementType === 'IN' ? 'Stock In' : 'Stock Out'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{movement.quantity}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{movement.notes || '-'}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Stock Movement Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Add Stock Movement
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
                        Product
                      </label>
                      <select
                        name="productId"
                        id="productId"
                        value={formData.productId}
                        onChange={handleInputChange}
                        required
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select a product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} (Current: {product.quantity})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="movementType" className="block text-sm font-medium text-gray-700">
                        Movement Type
                      </label>
                      <select
                        name="movementType"
                        id="movementType"
                        value={formData.movementType}
                        onChange={handleInputChange}
                        required
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="IN">Stock In</option>
                        <option value="OUT">Stock Out</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        id="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="3"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button
                    type="submit"
                    variant="primary"
                    className="sm:ml-3"
                  >
                    Create
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCloseModal}
                    className="mt-3 sm:mt-0"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}