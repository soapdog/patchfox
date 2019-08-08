import timeago from "timeago-simple";

const timestamp = t => {

    return timeago.simple(new Date(t))
}

export default timestamp;
