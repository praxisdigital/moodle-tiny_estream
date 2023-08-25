<?php
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
 * @module      tiny_estream/utils
 * @copyright   2023 Uniguest <ben.goulden@uniguest.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace tiny_estream;

class utils {

      public static function tinymce_planetestream_getchecksum() {
      $decchecksum = (float)(date('d') + date('m')) + (date('m') * date('d')) + (date('Y') * date('d'));
      $decchecksum += $decchecksum * (date('d') * 2.27409) * .689274;
      return md5(floor($decchecksum));
  }

    public static function tinymce_planetestream_obfuscate($strx) {
    $strbase64chars = '0123456789aAbBcCDdEeFfgGHhiIJjKklLmMNnoOpPQqRrsSTtuUvVwWXxyYZz/+=';
    $strbase64string = base64_encode($strx);
    if ($strbase64string == '') {
        return '';
    }
    $strobfuscated = '';
    for ($i = 0; $i < strlen ($strbase64string); $i ++) {
        $intpos = strpos($strbase64chars, substr($strbase64string, $i, 1));
        if ($intpos == - 1) {
            return '';
        }
        $intpos += strlen($strbase64string ) + $i;
        $intpos = $intpos % strlen($strbase64chars);
        $strobfuscated .= substr($strbase64chars, $intpos, 1);
    }
    return urlencode($strobfuscated);
}

 public static function tinymce_planetestream_getauthticket($url, $checksum, $delta, $userip, &$params) {
  $return = '';
  try {
      $url .= '/VLE/Moodle/Auth/?source=1&checksum=' . $checksum . '&delta=' . $delta . '&u=' . $userip;
      if (!$curl = curl_init($url)) {
          return '';
      }
      curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 15);
      curl_setopt($curl, CURLOPT_TIMEOUT, 15);
      curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
      curl_setopt($curl, CURLOPT_MAXREDIRS, 4);
      curl_setopt($curl, CURLOPT_FORBID_REUSE, true);
      curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
      $response = curl_exec($curl);
      if (strpos($response, '{"ticket":') === 0) {
          $jobj = json_decode($response);
          $return = $jobj->ticket;
          $params['estream_height'] = $jobj->height;
          $params['estream_width'] = $jobj->width;
      }
  } catch (Exception $e) {
      // ... non-fatal ...
  }
  return $return;
}

    public static function funcBuildiFrame(): string {
      global $PAGE, $USER, $CFG;
        $url = rtrim(get_config('assignsubmission_estream', 'url') , '/');  
        
        $checksum = self::tinymce_planetestream_getchecksum();
      
        profile_load_data($USER);

        if (isset($USER->profile_field_planetestreamusername) && !empty($USER->profile_field_planetestreamusername)) {
          $delta = self::tinymce_planetestream_obfuscate($USER->profile_field_planetestreamusername);
          } else {
          if (get_config('assignsubmission_estream', 'usemail') == true) {
          $delta = self::tinymce_planetestream_obfuscate($USER->email);
        } else {
          $delta = self::tinymce_planetestream_obfuscate($USER->username);
        }
          }
          
              $userip = self::tinymce_planetestream_obfuscate(getremoteaddr());
              $authticket = self::tinymce_planetestream_getauthticket($url, $checksum, $delta, $userip, $params);
              if ($authticket == '') {
                  $params['disabled'] = true;
              }
          
          $assignmode = "false";
          
          $pagetype = (string)$PAGE->pagetype;
          
          if ($pagetype == 'mod-assign-editsubmission') {
              $assignmode = "true";
          }
          
          if ($pagetype == 'mod-assign-gradingpanel') {
              $assignmode = "true";
          }
          
          if ($pagetype == 'mod-assign-editsubmission' || $pagetype == 'mod-assign-gradingpanel') { 
          
            $path = '/VLE/Moodle/Default.aspx?delta=' . $delta . '&checksum=' . $checksum
              . '&ticket=' . $authticket . '&inlinemode=moodle&assign=true';
              $path .= '&mpu=' . ($pagetype == 'mod-assign-view' ? "true" : "false");        
          if ($authticket != '') {
            $path .= '&estream_width=' . $params['estream_width'];
            $path .= '&estream_height=' . $params['estream_height'];
        }
          $path .= '&estream_url=' . $url;       
            
          } else {
            
              $path = '/VLE/Moodle/Default.aspx?delta=' . $delta . '&checksum=' . $checksum
              . '&ticket=' . $authticket . '&inlinemode=moodle';
              $path .= '&mpu=' . ($pagetype == 'mod-assign-view' ? "true" : "false");
          $path .= '&assign=' . $assignmode;
          $path .= '&pagetype=' . $pagetype;      
          if ($authticket != '') {
            $path .= '&estream_width=' . $params['estream_width'];
            $path .= '&estream_height=' . $params['estream_height'];
        }
          $path .= '&estream_url=' . $url;
     
          }

$url = $url . $path;

        $iframe = \html_writer::start_tag('iframe', [     
                'id' => 'PESiframe',
                'frameborder' => 0,
                'height' => '500',
                'width' => '750',
                'src' => $url,
                'allow' => 'microphone; camera; display-capture;'
        ]);

        $iframe .= \html_writer::end_tag('iframe');

        return \html_writer::div($iframe, '');
    }

   

}
