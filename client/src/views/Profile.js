import './Profile.css';
import React, { useEffect, useState } from 'react'
import Card from '../components/Card';
import API from '../util/API'
import {useNavigate} from 'react-router-dom';

const Profile = (props) => {
  const navigate = useNavigate()

  const [user, setUser] = useState([])
  const [userHunts, setUserHunts] = useState([])

  const fetchUser = async () => {
    const userId = JSON.parse(localStorage.getItem('user')).id
    API.getUser(userId).then(res => {
      const user = res;
      setUser(user)
      const userHunts = user.hunts
      setUserHunts(userHunts)
    })
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Update clicked")
    console.log(e.currentTarget.id);
    navigate('../updatemyhunt')
    localStorage.setItem('hunt', e.currentTarget.id);
    localStorage.setItem('huntinfo', e.currentTarget);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user')
    const token = user.token

    API.deleteHunt(userHunts[e.target.getAttribute('data-buttonid')]._id, token)
      .then(res => {
        if (res) {
          window.location.reload(true)
          console.log(`hunt id ${userHunts[e.target.getAttribute('data-buttonid')]._id} deleted`)
        }
      })
  };

  useEffect(() => {
    fetchUser();
  }, [props.isLoggedIn]);


  return (
    <>
      <h1>Welcome {user.username}!</h1>
      <h2> Your Hunts:</h2>
      {props.isLoggedIn ? (
        <>
          {
            userHunts.map((data, index) => (
              <div className='row'>
                <div className='column'>
                  <div className="nes-container is-rounded">
                    <Card hunt={data} key={index} />
                    <button id={data._id} type="button" className="nes-btn is-primary" onClick={handleUpdate}>Update</button>
                    <button type="button" className="nes-btn is-error" data-buttonid={index} onClick={handleDelete}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          }
        </>
      ) : (
        <h1>Loading....</h1>
      )
      }
    </>
  )
}

export default Profile