// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * eStream TinyMCE
 *
 * @module      tiny_estream/ui
 * @copyright   2023 Uniguest <ben.goulden@uniguest.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Modal from 'tiny_estream/modal';
import ModalFactory from 'core/modal_factory';
import {getIframe} from "./options";

export const handleAction = (editor) => {
    displayDialogue(editor);
};

/**
 * Get the template context for the dialogue.
 *
 * @param {Editor} editor
 * @param {object} data
 * @returns {object} data
 */
const getTemplateContext = (editor, data) => {
    return Object.assign({}, {
        iframe: getIframe(editor),
    }, data);
};

/**
 * Split out querystring values
 *
 * @param {String} query
 * @param {String} variable
 * @returns {object} data
 */
function getQS(query, variable) {
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return "Response";
}

const displayDialogue = async(editor, data = {}) => {
    const modal = await ModalFactory.create({
        type: Modal.TYPE,
        templateContext: getTemplateContext(editor, data),
        large: true
    });

    modal.show();

    const iframe = document.getElementById("PESiframe");
    const src = iframe.src;

    if (window.addEventListener) {
        eventMethod = 'addEventListener';
        messageEvent = 'message';
    } else if (window.postMessage) {
        eventMethod = 'attachEvent';
        messageEvent = 'onmessage';
    } else {
        editor.execCommand('mceInsertContent', false, "Sorry, your web browser is not compatible with this feature.");
    }

    var evX = window[eventMethod];
    evX(messageEvent, function (e) {



        var data = String(e.data);

            if (data.indexOf("ID=") > -1) {
                if (data.indexOf("&source=moodle") > -1 || data.indexOf("&source=Moodle") > -1) {
                    
                    var pagetype = decodeURIComponent(getQS(src, "pagetype"));
                    var assignmode = decodeURIComponent(getQS(src, "assign"));

                    //if (pagetype == 'mod-assign-editsubmission' || pagetype == 'mod-assign-gradingpanel') {
                        if (assignmode == 'true') {


                    var title = decodeURIComponent(getQS(data, "title"));
                        title = title.split("+").join(" ");

                    if (data.indexOf("delta=") > -1) {
                        editor.execCommand('mceInsertContent', false, '<a href="'
            + getQS(src, 'estream_url') + '/View.aspx?' + data + '" target="_blank">' + title + '</a><br><br>');
            modal.destroy();
                    } else {
                        editor.execCommand('mceInsertContent', false, '<a href="'
            + getQS(src, 'estream_url') + '/View.aspx?' + data + '&delta=ESDLTA" target="_blank">' + title + '</a><br><br>');
            modal.destroy();
                    }

                    } else {

                        if (getQS(src, 'estream_width', true) == "0" && getQS(src, 'estream_height', true) == "0") {

                    if (data.indexOf("delta=") > -1) {

                        editor.execCommand('mceInsertContent', false, '<div style="position:relative;overflow:hidden;padding-top:56.25%;"><iframe allow="autoplay; fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="'
                    + getQS(src, 'estream_url', true) + '/Embed.aspx?' + data + '" ></iframe><a href="'
                    + '/_planetestreamiframe_/Embed.aspx?' + data + '">&nbsp;</a></div>');
                    modal.destroy();
                    } else {
                    
                        editor.execCommand('mceInsertContent', false, '<div style="position:relative;overflow:hidden;padding-top:56.25%;"><iframe allow="autoplay; fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="'
                    + getQS(src, 'estream_url', true) + '/Embed.aspx?' + data + '&delta=ESDLTA" ></iframe><a href="'
                    + '/_planetestreamiframe_/Embed.aspx?' + data + '">&nbsp;</a></div>');
                    modal.destroy();
                    }
                         
                    } else {
                    
                    if (data.indexOf("delta=") > -1) {
                    
                        editor.execCommand('mceInsertContent', false, '<iframe allow="autoplay; fullscreen" allowfullscreen style="width: ' + getQS(src, 'estream_width') + 'px;'
                    + ' height: ' + getQS(src, 'estream_height') + 'px; border: 0;" src="'
                    + getQS(src, 'estream_url') + '/Embed.aspx?' + data + '" ></iframe><a href="'
                    + '/_planetestreamiframe_/Embed.aspx?' + data + '">&nbsp;</a>');
                    modal.destroy();
                    } else {
                    
                        editor.execCommand('mceInsertContent', false, '<iframe allow="autoplay; fullscreen" allowfullscreen style="width: ' + getQS(src, 'estream_width') + 'px;'
                    + ' height: ' + getQS(src, 'estream_height') + 'px; border: 0;" src="'
                    + getQS(src, 'estream_url') + '/Embed.aspx?' + data + '&delta=ESDLTA" ></iframe><a href="'
                    + '/_planetestreamiframe_/Embed.aspx?' + data + '">&nbsp;</a>');
                    modal.destroy();
                    }
                    
                    }
                    
                    }
                    
                    }
                    }
            
       
    
  
        

    }, false);

};
