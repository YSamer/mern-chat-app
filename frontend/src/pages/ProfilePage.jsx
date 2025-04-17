import { Camera, Mail, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { user, updateProfile, isUpdatingProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name,
    email: user?.email,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const validateForm = () => {
    const { name, email, password } = formData;
    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Invalid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      await updateProfile(formData);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result;
      setSelectedFile(base64);
      // await updateProfile({ avatar: base64 });
      setFormData({ ...formData, avatar: base64 });
    };
  };

  return (
    <div className="h-full pt-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Update your profile information</p>
          </div>
          {/* Avatar  upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedFile || user?.avatar || "/avatar.png"}
                alt="Avatar"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar"
                className={`
                absolute bottom-0 right-0 
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer 
                transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar"
                  className="hidden"
                  accept="image/*"
                  disabled={isUpdatingProfile}
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">
              {isUpdatingProfile
                ? "Updating..."
                : "Upload a new avatar to your profile"}
            </p>
          </div>
          {/* Name and email */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="form-control">
              <label htmlFor="name" className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>
            <div className="h-2"></div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              onClick={handleSubmit}
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? "Updating..." : "Update Profile"}
            </button>
          </form>

          <div className="bg-base-300 rounded-xl p-4">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member since</span>
                <span>{user?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span
                  className={`${
                    user?.isActive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {user?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
