import {get,post} from './http'

//管理员登录
export const getLoginStatus = (params) => post(`admin/login/status`,params);
//管理员退出登录
export const getLoginOut = () => get(`admin/logout`);
//通过adminId 查询管理员名
export const getNameById = (adminId) => get(`admin/getNameById?adminId=${adminId}`);

//============系统首页===========
//查询所有用户总数
export const getCountOfConsumer = () => get(`info/countConsumer`)   
//查询所有歌曲总数
export const getCountOfSong = () => get(`info/countSong`) 
//查询所有歌手总数
export const getCountOfSinger = () => get(`info/countSinger`) 
//查询所有歌单总数
export const getCountOfSongList = () => get(`info/countSongList`) 

//============用户相关===========

//查询所有用户
export const getConsumer = (pn) => get(`consumer/allConsumer?pn=${pn}`);//之前没有传参，所以分页显示数据失败
//查询VIP用户
export const getVipConsumer = (pn) => get(`consumer/allVipConsumer?pn=${pn}`);

//根据用户id 查询用户
export const getUserOfId = (id) => get(`consumer/getUserOfId?id=${id}`)

//删除一个用户
export const deleteConsumer = (id) => get(`consumer/delete?id=${id}`);
//批量删除
export const deleteSomeConsumer = (ids) => get(`consumer/someDelete?id=${ids}`);
//修改用户
export const updateConsumer = (params) => post(`consumer/update`,params);
//添加用户
export const addConsumer = (params) => post(`consumer/add`,params);
//模糊查询用户名
export const selectLikeUserName = (username)  => get(`consumer/selectLikeUserName?username=${username}`)

//==============歌手相关==========
//查询所有歌手
export const getSinger = (pn) => get(`singer/allSinger?pn=${pn}`);
//删除一个歌手
export const deleteSinger = (id) => get(`singer/delete?id=${id}`);
//添加歌手
export const addSinger = (params) => post(`singer/add`,params);
//批量删除
export const deleteSomeSinger = (ids) => get(`singer/someDelete?id=${ids}`);
//修改歌手
export const updateSinger = (params) => post(`singer/update`,params);

//=============歌曲管理==============
//添加歌曲
export const addOneSong = (params) => post(`song/add`,params);

//根据歌手查询所有歌曲
export const selectSongs = (pn,singerId) => get(`song/singer/selectSongs?pn=${pn}&singerId=${singerId}`);
//修改歌曲
export const updateSong = (params) => post(`song/updateSong`,params);
//删除一首歌曲
export const deleteSong = (id) => get(`song/deleteSong?id=${id}`);
//批量删除
export const deleteSomeSong = (ids) => get(`song/someDeleteSong?id=${ids}`);

//根据歌曲名获取歌曲对象
export const songByName = (name) => get(`song/songByName?name=${name}`);

//设置Vip歌曲
export const setVip= (id) => get(`song/setVip?id=${id}`);

//移除vip歌曲
export const removeVip= (id) => get(`song/removeVip?id=${id}`);


//根据歌曲id 查询该歌曲
export const songBySongId = (songId) => get(`song/songBySongId?songId=${songId}`)

//============歌单相关===========

//根据歌单名字 查询该歌单对象
export const songListByName = (name) => get(`songList/songListBySongId?name=${name}`)
//根据歌曲id 获取歌单对象
export const getSongListOfId = (id) => get(`songList/getSongListInfoById?id=${id}`)


//查询所有歌单
export const getSongList = (pn) => get(`songList/all?pn=${pn}`);
//删除一个歌单
export const deleteSongList = (id) => get(`songList/delete?id=${id}`);
//批量删除
export const deleteSongLists = (ids) => get(`songList/someDelete?id=${ids}`);
//修改歌单
export const updateSongList = (params) => post(`songList/update`,params);
//添加歌单
export const insertSongList = (params) => post(`songList/insert`,params);



//=============歌单中的歌曲管理===========


//向某个歌单添加歌曲
export const insertListSong = (params) => post(`listSong/insert`,params);
//根据歌单id查询歌曲Id
export const songIdBySongListId = (songListId) => get(`listSong/songIdBySongListId?songListId=${songListId}`)
//删除歌单中的一首歌
export const deleteListSong = (songId,songListId) => get(`listSong/delete?songId=${songId}&songListId=${songListId}`);
//批量删除歌单中的歌
export const deleteListSongs = (songIds,songListId) => get(`listSong/someDelete?songId=${songIds}&songListId=${songListId}`);

//=============VIP===========
//查询所有VIP套餐
export const getVipTypeList = () => get(`vipPrice/info`);
//删除一个
export const deleteVip = (id) => get(`vipPrice/delete?id=${id}`);
//修改
export const updateVip = (params) => post(`vipPrice/update`,params);
//添加
export const addVip = (params) => post(`vip/addVip`,params);
//模糊查询套餐名
// export const selectLikeUserName = (username)  => get(`consumer/selectLikeUserName?username=${username}`)

//根据用户id获取 用户VIP 信息
export const getVipInfo =(userId) => get(`vip/selectTime?userId=${userId}`);



//=============评论===========
export const getComment = (songListId,pn) => get(`comment/commentOfSongListIdPage?songListId=${songListId}&&pn=${pn}`);//获取某个歌单的评论
export const updateComment = (params) => post(`comment/updateCom`,params);//更新（编辑后）
export const deleteComment = (id) => get(`comment/delComment?id=${id}`);//删除单个
export const deleteSomeComment = (ids) => get(`comment/someDelete?id=${ids}`);//删除所有

//=============收藏===========
export const getCollect = (pn,userId) => get(`collect/getCollect?pn=${pn}&&userId=${userId}`);//获取收藏
export const deleteCollect= (id) => get(`collect/deleteCollect?id=${id}`);//取消收藏
export const deleteSomeCollect = (ids) => get(`collect/someDeleteCol?id=${ids}`);//取消多个收藏





