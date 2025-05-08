import React from 'react';
import { UserPlus } from 'lucide-react';

const recommendedUsers = [
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'The Synth Band',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'DJ Galaxy',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
];

const RightSidebar = () => {
  return (
    <div
      className="d-none d-lg-block"
      style={{
        width: '300px',
        marginLeft: '20px',
        position: 'sticky',
        top: '80px',
        height: 'fit-content',
      }}
    >
      <div className="bg-dark text-white p-3 rounded-4 shadow-lg">
        <h6 className="mb-3 text-light fw-bold">Recommended Artists</h6>
        <div className="d-flex flex-column gap-3">
          {recommendedUsers.map((user) => (
            <div
              key={user.id}
              className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-secondary bg-opacity-25 hover-shadow transition"
              style={{
                cursor: 'pointer',
                transition: 'background 0.3s ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = '#343a40')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'rgba(108,117,125,0.25)')
              }
            >
              <div className="d-flex align-items-center">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="rounded-circle me-2"
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                    border: '2px solid #6c757d',
                  }}
                />
                <span className="text-light fw-medium">{user.name}</span>
              </div>
              <button className="btn btn-outline-light btn-sm d-flex align-items-center gap-1">
                <UserPlus size={16} />
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
