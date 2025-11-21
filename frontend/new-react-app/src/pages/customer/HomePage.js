import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/customer.css';

const HomePage = () => {
  return (
    <div className="customer-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Our Restaurant</h1>
          <p className="hero-subtitle">Experience the finest dining with our delicious menu</p>
          <div className="hero-buttons">
            <Link to="/menu" className="btn btn-primary-large">
              Order Now 🍽️
            </Link>
            <Link to="/reservations" className="btn btn-secondary-large">
              Reserve a Table 📅
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🍕</div>
              <h3>Fresh Ingredients</h3>
              <p>We use only the freshest, locally-sourced ingredients in all our dishes</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Delivery</h3>
              <p>Get your favorite meals delivered hot and fresh to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🍳</div>
              <h3>Expert Chefs</h3>
              <p>Our experienced chefs prepare every dish with passion and care</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎁</div>
              <h3>Loyalty Rewards</h3>
              <p>Earn points with every order and unlock exclusive rewards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Preview */}
      <section className="popular-section">
        <div className="container">
          <h2 className="section-title">Our Popular Dishes</h2>
          <p className="section-subtitle">Try our customers' favorite items</p>
          <div className="popular-grid">
            <div className="popular-card">
              <div className="popular-image">🍕</div>
              <h3>Margherita Pizza</h3>
              <p className="price">$12.99</p>
            </div>
            <div className="popular-card">
              <div className="popular-image">🍔</div>
              <h3>Classic Burger</h3>
              <p className="price">$9.99</p>
            </div>
            <div className="popular-card">
              <div className="popular-image">🍝</div>
              <h3>Pasta Carbonara</h3>
              <p className="price">$14.99</p>
            </div>
            <div className="popular-card">
              <div className="popular-image">🍰</div>
              <h3>Chocolate Cake</h3>
              <p className="price">$6.99</p>
            </div>
          </div>
          <div className="text-center" style={{marginTop: '2rem'}}>
            <Link to="/menu" className="btn btn-primary">
              View Full Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* Food Challenges Banner */}
      <section className="challenges-banner">
        <div className="container">
          <div className="challenge-content">
            <h2>🏆 Join Our Food Challenges!</h2>
            <p>Complete challenges, win rewards, and show off your foodie skills</p>
            <Link to="/challenges" className="btn btn-challenge">
              View Challenges
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Best pizza I've ever had! The ingredients are so fresh and the service is excellent."</p>
              <p className="customer-name">- John D.</p>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Love the online ordering system. So easy to use and my food always arrives hot!"</p>
              <p className="customer-name">- Sarah M.</p>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"The food challenges are so fun! I've earned so many loyalty points already."</p>
              <p className="customer-name">- Mike R.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Order?</h2>
          <p>Join thousands of satisfied customers today</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-light-large">
              Sign Up Now
            </Link>
            <Link to="/menu" className="btn btn-primary-large">
              Browse Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;