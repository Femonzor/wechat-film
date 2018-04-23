import ReplyTextMessage from "../model/message/reply/textMessage";
import ReplyNewsMessage from "../model/message/reply/newsMessage";
import ReplyImageMessage from "../model/message/reply/imageMessage";
import ReplyVideoMessage from "../model/message/reply/videoMessage";
import ReplyVoiceMessage from "../model/message/reply/voiceMessage";
import ReplyMusicMessage from "../model/message/reply/musicMessage";
import { type } from "./common";
import Wechat from "../model/wechat";
import config from "../config";

const wechatApi = new Wechat(config.wechat);

export const getReplyObject = async message => {
    let data, replyType, result;
    const options = {};
    const { MsgType } = message;
    if (MsgType === "event") {
        const { Event } = message;
        if (Event === "subscribe") {
            console.log("message:", message);
            const { EventKey, Ticket } = message;
            if (Ticket) console.log(`扫二维码进来: ${EventKey} ${Ticket}`);
            else console.log("关注公众号");
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
            data = await wechatApi.uploadMaterial("image", "/Users/yzw/Code/wechat-film/resource/favicon.png");
        } else if (Content === "5") {
            replyType = "video";
            data = await wechatApi.uploadMaterial("video", "/Users/yzw/Code/wechat-film/resource/video.mp4");
        } else if (Content === "6") {
            replyType = "voice";
            data = await wechatApi.uploadMaterial("voice", "/Users/yzw/Code/wechat-film/resource/voice.mp3");
        } else if (Content === "7") {
            replyType = "music";
            data = await wechatApi.uploadMaterial("thumb", "/Users/yzw/Code/wechat-film/resource/thumb.jpg");
        } else if (Content === "8") {
            replyType = "text";
            data = await wechatApi.uploadMaterial("image", "/Users/yzw/Code/wechat-film/resource/favicon.png", true);
            console.log(data);
            data = data.url;
        } else if (Content === "9") {
            replyType = "video";
            data = await wechatApi.uploadMaterial("video", "/Users/yzw/Code/wechat-film/resource/video.mp4", {
                description: JSON.stringify({
                    title: "永久视频",
                    introduction: "永久视频介绍"
                })
            });
        } else if (Content === "10") {
            replyType = "news";
            data = await wechatApi.uploadMaterial("image", "/Users/yzw/Code/wechat-film/resource/favicon.png", {});
            const picUrl = data.url;
            const media = {
                articles: [{
                    title: "图文1",
                    thumb_media_id: data.media_id,
                    author: "yzw",
                    digest: "没有摘要",
                    show_cover_pic: 1,
                    content: "没有内容",
                    content_source_url: "https://github.com"
                }, {
                    title: "图文2",
                    thumb_media_id: data.media_id,
                    author: "yzw",
                    digest: "没有摘要",
                    show_cover_pic: 1,
                    content: "没有内容",
                    content_source_url: "https://github.com"
                }]
            };
            data = await wechatApi.uploadMaterial("news", media, {});
            data = await wechatApi.getMaterial(data.media_id, "news", {});
            const newsItems = data.news_item;
            const news = [];
            newsItems.forEach(item => {
                news.push({
                    Title: item.title,
                    Description: item.description,
                    PicUrl: picUrl,
                    Url: item.url
                });
            });
            data = news;
        } else if (Content === "11") {
            const counts = await wechatApi.countMaterial();
            console.log("counts: %s", JSON.stringify(counts));
            const results = await Promise.all([
                wechatApi.batchGetMaterial({
                    type: "image",
                    offset: 0,
                    count: 10
                }),
                wechatApi.batchGetMaterial({
                    type: "video",
                    offset: 0,
                    count: 10
                }),
                wechatApi.batchGetMaterial({
                    type: "voice",
                    offset: 0,
                    count: 10
                }),
                wechatApi.batchGetMaterial({
                    type: "news",
                    offset: 0,
                    count: 10
                })
            ]);
            console.log("results: %s", JSON.stringify(results));
            data = "看服务器～";
            replyType = "text";
        } else if (Content === "12") {
            let results = await Promise.all([
                wechatApi.batchGetMaterial({
                    type: "image",
                    offset: 0,
                    count: 10
                }),
                wechatApi.batchGetMaterial({
                    type: "video",
                    offset: 0,
                    count: 10
                }),
                wechatApi.batchGetMaterial({
                    type: "voice",
                    offset: 0,
                    count: 10
                }),
                wechatApi.batchGetMaterial({
                    type: "news",
                    offset: 0,
                    count: 10
                })
            ]);
            results.forEach(item => {
                console.log(item);
                item.item.forEach(material => {
                    wechatApi.deleteMaterial(material.media_id);
                });
            });
            results = await Promise.all([
                wechatApi.batchGetMaterial({
                    type: "image",
                    offset: 0,
                    count: 10
                }),
                wechatApi.batchGetMaterial({
                    type: "video",
                    offset: 0,
                    count: 10
                }),
                wechatApi.batchGetMaterial({
                    type: "voice",
                    offset: 0,
                    count: 10
                }),
                wechatApi.batchGetMaterial({
                    type: "news",
                    offset: 0,
                    count: 10
                })
            ]);
            console.log("results: %s", JSON.stringify(results));
            data = "删除喽～";
            replyType = "text";
        } else if (Content === "13") {
            const group = await wechatApi.createGroup("wechat");
            console.log("new group:", group);
            let groups = await wechatApi.getGroups();
            console.log("get groups:", groups);
            const myGroup = await wechatApi.getGroupId(message.FromUserName);
            console.log("my group:", myGroup);
            result = await wechatApi.moveGroup(message.FromUserName, 101);
            console.log("move to groupid: 101,", result);
            groups = await wechatApi.getGroups();
            console.log("after move group, get groups:", groups);
            result = await wechatApi.moveGroup([message.FromUserName], 0);
            console.log("move to groupid: 0,", result);
            groups = await wechatApi.getGroups();
            console.log("after batch move group, get groups:", groups);
            result = await wechatApi.updateGroup(101, "wechat100");
            console.log("update group,", result);
            groups = await wechatApi.getGroups();
            console.log("after update group, get groups:", groups);
            result = await wechatApi.deleteGroup(101);
            console.log("delete group 101", result);
            groups = await wechatApi.getGroups();
            console.log("after delete group, get groups:", groups);
            data = "查询分组";
            replyType = "text";
        } else if (Content === "14") {
            const user = await wechatApi.getUsers(message.FromUserName);
            console.log("get user:", user);
            const users = await wechatApi.getUsers([{
                openid: message.FromUserName,
                lang: "en"
            }]);
            console.log("batch get users:", users);
            data = "获取用户";
            replyType = "text";
        } else if (Content === "15") {
            const userList = await wechatApi.listUsers();
            console.log(userList);
            data = `用户列表长度: ${userList.total}`;
            replyType = "text";
        } else if (Content === "16") {
            let tag = await wechatApi.createTag("fans1");
            console.log("new tag:", tag);
            const tags = await wechatApi.getTags();
            console.log("tags:", tags);
            result = await wechatApi.updateTag(tag.tag.id, "newfans1");
            console.log("update tag:", result);
            result = await wechatApi.deleteTag(tag.tag.id);
            console.log("delete tag:", result);
            tag = await wechatApi.createTag("粉丝1");
            const userList = await wechatApi.listUsers();
            console.log("new tag:", tag);
            result = await wechatApi.batchTag(userList.data.openid, tag.tag.id);
            console.log("batch tag:", result);
            let tagUsers = await wechatApi.getTagUsers(tag.tag.id);
            console.log("tagUsers:", tagUsers);
            let userTags = await wechatApi.getUserTags(message.FromUserName);
            console.log("userTags:", userTags);
            result = await wechatApi.batchTag(userList.data.openid, tag.tag.id, true);
            console.log("batch untag:", result);
            tagUsers = await wechatApi.getTagUsers(tag.tag.id);
            console.log("tagUsers:", tagUsers);
            userTags = await wechatApi.getUserTags(message.FromUserName);
            console.log("userTags:", userTags);
            data = "查询标签";
            replyType = "text";
        } else if (Content === "17") {
            const mpnews = {
                media_id: "LqHt_PvUN2rjqDqMAkg3TtEyMBB-tekrEZCzuYycMmI"
            };
            const text = {
                content: "群发文本"
            };
            const msgData = await wechatApi.sendByTag("mpnews", mpnews, 116);
            // const msgData = await wechatApi.sendByTag("text", text, 116);
            console.log("msgData:", msgData);
            data = "群发";
            replyType = "text";
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
        Object.assign(options, {
            MediaId: data.media_id,
            Title: "视频",
            Description: "视频简介"
        });
        return new ReplyVideoMessage(options);
    } else if (replyType === "voice") {
        Object.assign(options, {
            MediaId: data.media_id
        });
        return new ReplyVoiceMessage(options);
    } else if (replyType === "music") {
        Object.assign(options, {
            Title: "音乐标题",
            Description: "音乐简介",
            MusicUrl: "http://ting666.yymp3.com:86/new27/huling7/1.mp3",
            HQMusicUrl: "http://ting666.yymp3.com:86/new27/zhangbeibei/1.mp3",
            ThumbMediaId: data.thumb_media_id
        });
        return new ReplyMusicMessage(options);
    }
    return null;
};
