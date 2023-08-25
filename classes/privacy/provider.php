<?php
// …

namespace tiny_estream\privacy;

class provider {

public static function get_metadata(collection $collection): collection {
    $collection->add_external_location_link('tiny_estream', [
            'userid' => 'privacy:metadata:tiny_estream:userid',            
		    'email' => 'privacy:metadata:tiny_estream:email',
            'userip' => 'privacy:metadata:tiny_estream:userip',
        ], 'privacy:metadata:tiny_estream');

    return $collection;
}

}