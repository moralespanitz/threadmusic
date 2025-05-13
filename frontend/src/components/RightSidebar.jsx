import React, { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import mockUsers from './something';

const getRandomUsers = (users, count) => {
  const shuffled = [...users].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const RightSidebar = () => {
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const randomUsers = getRandomUsers(Object.values(mockUsers), 5);
    setRecommendedUsers(randomUsers);
  }, []);

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
              onClick={() => navigate(`/${user.username}`)}
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
                <span className="text-light fw-medium">{user.username}</span>
              </div>
              <button
                className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent redirect on button click
                }}
              >
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
