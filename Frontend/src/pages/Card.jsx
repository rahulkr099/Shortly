import PropTypes from 'prop-types';

function Card({ item }) {
  console.log("Card Item:", item);

  return (
    <div className="max-w-sm border border-gray-300 rounded-lg shadow-lg m-4 p-4 transition hover:shadow-xl bg-blue-100">
      {/* Image Section */}
      <div className="w-full h-44 overflow-hidden rounded-md mb-4">
        <img
          src={item.thumbnailImage}
          alt={item.name || "Product image"}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Content Section */}
      <div>
        <h5 className="text-lg font-semibold mb-1">{item.name}</h5>
        <h5 className="text-2xl font-bold text-green-600 border-b border-gray-300 pb-2 mb-2">
          Rs. {item.basePrice}
        </h5>
        <p className="text-gray-600 mb-4">
          {item.description.substring(0, 60)}...
        </p>
      </div>

      {/* Add to Cart Button */}
      <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
        Add to Cart
      </button>
    </div>
  );
}

// Prop Validation
Card.propTypes = {
  item: PropTypes.shape({
    thumbnailImage: PropTypes.string.isRequired,  // Image URL is required
    name: PropTypes.string.isRequired,  // Title is required
    basePrice: PropTypes.number.isRequired,  // Price should be a number and is required
    description:PropTypes.string.isRequired,
  }).isRequired,
};

export default Card;
