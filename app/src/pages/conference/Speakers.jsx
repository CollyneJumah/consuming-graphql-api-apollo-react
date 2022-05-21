import * as React from "react";
import "./style-sessions.css";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

/* ---> Define queries, mutations and fragments here */
const SPEAKER_ATTRIBUTES= gql`
  fragment SpeakerInfo on Speaker{
    id
    name
    bio
    sessions {
      id  
      title
    }
  }
`
const SPEAKERS= gql`
  query speakers{
    speakers{
     ...SpeakerInfo
    }
  }
  ${SPEAKER_ATTRIBUTES}
`
//Fragment: Query by speakers Id to
const SPEAKER_BY_ID = gql`
  query speakerById($id: ID) {
    speakerById(id: $id){
      ...SpeakerInfo
    }
  }
  ${SPEAKER_ATTRIBUTES}
`

const SpeakerList = () => {

  /* ---> Replace hardcoded speaker values with data that you get back from GraphQL server here */
  const {loading,error,data} = useQuery(SPEAKERS) 
  if(loading) return <p>Loading Speakers</p>
  if(error)  return <p>Error occur loading speakers.</p>

  const featured = false;

  return data.speakers.map( ({id,name,bio,sessions})=>(
    <div
    key={id}
    className="col-xs-12 col-sm-6 col-md-6"
    style={{ padding: 5 }}
  >
    <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">{`Speaker: ${name}`}</h3>
      </div>
      <div className="panel-body">
        <h5>{`Bio: ${bio}`}</h5>
      </div>
      <div className="panel-footer">
        <h4>Sessions</h4>
        {
          /* ---> Loop through speaker's sessions here */
          sessions.map( (session)=>(
           <span key={session.id} style={{padding: 2}}>
             <p>{session.title}</p>
           </span>
          ))
        }
        <span>	
          <button	
            type="button"	
            className="btn btn-default btn-lg"	
            onClick={()=> {
              /* ---> Call useMutation's mutate function to mark speaker as featured */
            }}	
            >	
              <i	
                className={`fa ${featured ? "fa-star" : "fa-star-o"}`}	
                aria-hidden="true"	
                style={{	
                  color: featured ? "gold" : undefined,	
                }}	
              ></i>{" "}	
              Featured Speaker	
          </button>	
        </span>
      </div>
    </div>
  </div>
  ));
};

const SpeakerDetails = () => {
    /* ---> Replace hardcoded speaker values with data that you get back from GraphQL server here */
    const {speaker_id} = useParams()
    const {loading,error,data} = useQuery(SPEAKER_BY_ID, {
      variables: {id: speaker_id}
    })
    if(loading) return <p>Loading speakers details.</p>
    if(error) return <p>Error occur. Please try again.</p>

    const speaker = data.speakerById
    const {id,name,bio,sessions} = speaker
  return (
    <div key={id} className="col-xs-12" style={{ padding: 5 }}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{name}</h3>
        </div>
        <div className="panel-body">
          <h5>{bio}</h5>
        </div>
        <div className="panel-footer">
          {
						/* ---> Loop through speaker's sessions here */
           sessions.map( ({id,title})=>(
             <span key={id} style={{padding:5}}>
               "{title}"
             </span>
           ))
					}
        </div>
      </div>
    </div>
  );
};

export function Speaker() {
  return (
    <>
      <div className="container">
        <div className="row">
          <SpeakerDetails />
        </div>
      </div>
    </>
  );
}


export function Speakers() {
  return (
    <>
      <div className="container">
        <div className="row">
          <SpeakerList />
        </div>
      </div>
    </>
  );
}

	
