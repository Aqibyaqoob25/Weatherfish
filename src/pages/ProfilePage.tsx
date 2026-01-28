import React from "react";
import Header from "../components/Header";
import UserProfile from "../components/UserProfile";

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Header />
        <main className="mt-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Your profile</h2>
            <UserProfile />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
