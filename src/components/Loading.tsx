import styled from 'styled-components'

const Lsd = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #001539;
`

export const Loading = () => {
    return (
        <Lsd>
            <div className='lds-ellipsis'><div></div><div></div><div></div><div></div></div>
        </Lsd>
    )
}