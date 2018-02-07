import ReplyTextMessage from "../model/message/reply/textMessage";
import ReplyNewsMessage from "../model/message/reply/newsMessage";
import ReplyImageMessage from "../model/message/reply/imageMessage";
import ReplyVideoMessage from "../model/message/reply/videoMessage";
import { type } from "./common";
import Wechat from "../model/wechat";
import config from "../config";

const wechatApi = new Wechat(config.wechat);

export const getReplyObject = async message => {
    let data, replyType;
    const options = {};
    const { MsgType } = message;
    if (MsgType === "event") {
        const { Event } = message;
        if (Event === "subscribe") {
            console.log(`扫二维码进来: ${message.EventKey} ${message.Ticket}`);
            data = "您好!"
        } else if (Event === "unsubscribe") {
            console.log("取消关注!");
        } else if (Event === "LOCATION") {
            data = `您上报的位置是: ${message.Latitude}/${message.Longitude}-${message.Precision}`;
        } else if (Event === "CLICK") {
            data = `您点击了菜单: ${message.EventKey}`;
        } else if (Event === "SCAN") {
            console.log(`关注后扫二维码: ${message.EventKey} ${message.Ticket}`);
            data = "又扫了下二维码～";
        } else if (Event === "VIEW") {
            data = `您点击了菜单中的链接: ${message.EventKey}`;
        }
        replyType = "text";
    } else if (MsgType === "text") {
        const { Content } = message;
        if (Content === "1") {
            replyType = "text";
            data = "大米";
        } else if (Content === "2") {
            replyType = "text";
            data = "豆腐";
        } else if (Content === "3") {
            replyType = "news";
            data = [{
                Title: "naruto",
                Description: "火影忍者",
                PicUrl: "https://femonzor.com/resource/images/naruto.jpg",
                Url: "https://femonzor.com/resource/images/naruto.jpg"
            }, {
                Title: "koala",
                Description: "考拉",
                PicUrl: "https://femonzor.com/resource/images/koala.jpg",
                Url: "https://femonzor.com/resource/images/koala.jpg"
            }]
        } else if (Content === "4") {
            replyType = "image";
            data = await wechatApi.uploadMedia("image", "/Users/yzw/Code/wechat-film/resource/favicon.png");
        } else if (Content === "5") {
            replyType = "video";
            data = await wechatApi.uploadMedia("video", "/Users/yzw/Code/wechat-film/resource/video.mp4");
        } else if (Content === "6") {
            replyType = "voice";
            data = await wechatApi.uploadMedia("voice", "/Users/yzw/Code/wechat-film/resource/voice.mp3");
        }
    }
    Object.assign(options, {
        ToUserName: message.FromUserName,
        FromUserName: message.ToUserName
    });
    if (replyType === "text") {
        Object.assign(options, {
            Content: data
        });
        return new ReplyTextMessage(options);
    } else if (replyType === "news") {
        Object.assign(options, {
            ArticleCount: data.length,
            Articles: data
        });
        return new ReplyNewsMessage(options);
    } else if (replyType === "image") {
        Object.assign(options, {
            MediaId: data.media_id 
        });
        return new ReplyImageMessage(options);
    } else if (replyType === "video") {
        // console.log(data);
        Object.assign(options, {
            MediaId: data.media_id,
            Title: "视频",
            Description: "视频简介"
        });
        return new ReplyVideoMessage(options);
    }
    return null;
};
