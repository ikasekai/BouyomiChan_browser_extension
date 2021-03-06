console.log('content.js');
/* define */

//外部プラグインを使用するかのチェックボックスのID checkedが入っていたら棒読みちゃん連携プラグインにデータを渡す
var str_option_input_external_id = 'highchat_comment__util_read_external';

//外部プラグインについての説明文　外部プラグインがブラウザに導入されていたら非表示にする。
var str_option_guide_external_id = 'highchat_comment__util_read_external_guide';

// 外部プラグインに渡すテキストの監視対象htmlID
// 監視対象に変化があったら（MutationObserverが検知したら）内容物のテキストを棒読みちゃん連携プラグインにデータを渡す
var observe_target_id = 'ext_readtext';

// オプション値
var speak_on_activate = true;


/* function */
function extension_boyomi(readtext){
	var sending = ext_runtime.sendMessage({
		readtext: readtext
	});
}

function start_obserb(){
	observer.observe(ob_target, {
	  characterData: true,
		childList:true
	})
    // 読み上げ監視開始の通知
    if(speak_on_activate){
    	extension_boyomi("highchat2boyomi plugin ready");
    }
}

function stop_obserb(){
	observer.disconnect()
    // 読み上げ監視終了の通知
    if(speak_on_activate){
    	extension_boyomi("highchat2boyomi plugin deactivate");
    }
}





/* main */

//ChromeとFirefoxでruntime・storage切替
if(typeof browser !== 'undefined'){
	ext_runtime = browser.runtime;
	ext_storage = browser.storage.local
}else{
	ext_runtime = chrome.runtime;
	ext_storage = chrome.storage.sync
}

ext_runtime.sendMessage({pageAction_show:true})

// オプションデータ読み込み　フラグを見て監視開始
ext_storage.get(["speak_on_activate"], function(item) {
    speak_on_activate = item.speak_on_activate !== undefined ? item.speak_on_activate : true;
    if(option_input_external.checked){
        // 監視開始
    	start_obserb();
    }
});


// 監視オブジェクト生成
const ob_target = document.getElementById(observe_target_id);
const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		var readtext = mutation.target.textContent
		extension_boyomi(readtext);
	});    
});


// ページ内のプラグイン導入ガイド文を非表示
document.getElementById(str_option_guide_external_id).style.display = "none";



// ページ内のhtmlで制御切替

var option_input_external = document.getElementById(str_option_input_external_id);
option_input_external.parentNode.style.display = "inline";


option_input_external.addEventListener( "change", function(event){
	if( event.target.checked ){
		start_obserb();
	}else{
		stop_obserb();
	}
});