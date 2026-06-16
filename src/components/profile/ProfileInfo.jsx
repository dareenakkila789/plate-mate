import { User, X, Save } from 'lucide-react'

export default function ProfileInfo({
  user,
  isEditingProfile,
  setIsEditingProfile,
  editedUser,
  setEditedUser,
  handleUpdateProfile,
  actionLoading
}) {
  return (
    <div className="bg-white rounded-xl shadow-soft border border-primary border-opacity-20 p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="w-16 h-16 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text">My Profile</h2>
            <p className="text-gray-600">Member since {user.joinedDate}</p>
            <p className="text-gray-600">
              {user.totalRatings > 0
                ? `⭐ ${Number(user.averageRating || 0).toFixed(1)} (${user.totalRatings} ratings)`
                : 'No ratings yet'}
            </p>
          </div>
        </div>

        {!isEditingProfile && (
          <button
            onClick={() => setIsEditingProfile(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {isEditingProfile ? (
          <>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Full Name</label>
              <input
                type="text"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Email</label>
              <input
                type="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Location</label>
              <input
                type="text"
                value={editedUser.location}
                onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div className="md:col-span-3 flex space-x-4 mt-4">
              <button
                onClick={handleUpdateProfile}
                disabled={actionLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{actionLoading ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                onClick={() => {
                  setIsEditingProfile(false)
                  setEditedUser({
                    ...editedUser,
                    name: user.name,
                    email: user.email,
                    location: user.location
                  })
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-text rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-text font-medium">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <p className="text-text font-medium">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Location</label>
              <p className="text-text font-medium">{user.location}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}