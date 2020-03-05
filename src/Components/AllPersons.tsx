import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import React from 'react';

const PERSONS_QUERY = gql`
  {
    getAllPersons {
      id
      first_name
      last_name
      email
    }
  }
`;

export default function AllPersons() {
  const { loading, error, data } = useQuery(PERSONS_QUERY);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
    
    return data.getAllPersons.map(({ id, first_name, last_name, email }: {id: number, first_name: string, last_name: string, email: string}) => (
    <div key={id}>
      <p>
        {first_name} {last_name} - {email} 
      </p>
    </div>
  ));
}