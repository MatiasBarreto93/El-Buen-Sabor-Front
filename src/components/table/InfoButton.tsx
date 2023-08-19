import {InfoCircle} from "react-bootstrap-icons";

interface Props{
    onClick: () => void;
}

export const InfoButton = ({onClick}:Props) => {
  return(
      <InfoCircle
          color="#0070ff"
          size={24}
          onClick={onClick}
          onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
          onMouseLeave={() => { document.body.style.cursor = 'default' }}
      />
  )
}