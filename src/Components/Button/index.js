import { Button } from '@material-ui/core';

function Index(props) {
    return (
        <Button {...props} onClick={props.onClick}>
            {props.children}
        </Button>
    );
}
export default Index;
