import { useNavigate } from 'react-router-dom';
const Banner = () => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/');
    };
    return (
        <div className="hero min-h-screen bg-gradient-to-b from-rose-50 to-orange-50 font-poppins">
            <div className="text-center">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-bold text-gray-700">KUET - Your AI Travel Companion for a Perfect Getaway</h1>
                    <p className="py-6 text-gray-500">
                        Discover the art of effortless travel planning. With Voyage, your dream trip is just a few clicks away. Let our AI curate the perfect itinerary and manage your wonderful memories.
                    </p>
                    <button className="btn bg-gradient-to-r from-orange-primary to-orange-secondary text-base-100"
                        onClick={handleNavigation}
                    >Explore Now</button>
                </div>
            </div>
        </div>
    );
};

export default Banner;