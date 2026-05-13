<?php
/*
 * @ https://EasyToYou.eu - IonCube v14 Decoder Online
 * @ PHP 7.4
 * @ Decoder version: 1.0.2
 * @ Release: 10/08/2022
 */

// Decoded file for php version 74.

# vim: syntax=php tabstop=4 softtabstop=0 noexpandtab laststatus=1 ruler

/**
 * html/includes/init.php
 *
 * Initialization file for UNetLab.
 *
 * This file include all needed files and variables to run UNetLab. Don't
 * edit this file, it will be overwritten when updating. Create a new file
 * named 'config.php' under /opt/unetlab/html/includes and set some of all
 * the following parameters:
 *
 * define('DATABASE', '/opt/unetlab/data/database.sdb');
 * define('FORCE_VM', 'auto');
 * define('SESSION', '3600');
 * define('THEME', 'default');
 * define('TIMEZONE', 'Europe/Rome');
 *
 * @author Andrea Dainese <andrea.dainese@gmail.com>
 * @copyright 2014-2016 Andrea Dainese
 * @license BSD-3-Clause https://github.com/dainok/unetlab/blob/master/LICENSE
 * @link http://www.unetlab.com/
 * @version 20160719
 */

if (file_exists("/opt/unetlab/html/includes/config.php")) {
    require_once "/opt/unetlab/html/includes/config.php";
}
$eve_ver = file_get_contents("/opt/unetlab/html/themes/adminLTE/VERSION");
define("VERSION", $eve_ver);
define("BASE_DIR", "/opt/unetlab");
define("BASE_TMP", BASE_DIR . "/tmp");
if (!defined("THEME")) {
    define("THEME", "default");
}
define("BASE_THEME", "/themes/" . THEME);
if (file_exists("/opt/unetlab/natonly")) {
    $nat_only = file_get_contents("/opt/unetlab/natonly");
    if ($nat_only == "1") {
        define("NAT_ONLY", 1);
    } else {
        define("NAT_ONLY", 0);
    }
} else {
    define("NAT_ONLY", 0);
}
$UIlegacy = 1;
/*$dksum = [];
if (file_exists("/opt/unetlab/html/includes/custom_templates.yml") && !isset($custom_template)) {
    $custom_templates_yml = yaml_parse_file("/opt/unetlab/html/includes/custom_templates.yml");
    $custom_templates = [];
    foreach ($custom_templates_yml["custom_templates"] as $template) {
        $custom_templates[$template["name"]] = $template["listname"];
    }
}
*/
if (file_exists("/opt/unetlab/html/includes/config.yml")) {
    $config_yml = yaml_parse_file("/opt/unetlab/html/includes/config.yml");
    if (!defined("RADIUS_SERVER_IP") && isset($config_yml["radius"][0]["server"])) {
        define("RADIUS_SERVER_IP", $config_yml["radius"][0]["server"]);
    }
    if (!defined("RADIUS_SERVER_PORT") && isset($config_yml["radius"][0]["port"])) {
        define("RADIUS_SERVER_PORT", $config_yml["radius"][0]["port"]);
    }
    if (!defined("RADIUS_SERVER_SECRET") && isset($config_yml["radius"][0]["secret"])) {
        define("RADIUS_SERVER_SECRET", $config_yml["radius"][0]["secret"]);
    }
    if (!defined("RADIUS_SERVER_IP_2") && isset($config_yml["radius"][1]["server"])) {
        define("RADIUS_SERVER_IP_2", $config_yml["radius"][1]["server"]);
    }
    if (!defined("RADIUS_SERVER_PORT_2") && isset($config_yml["radius"][1]["port"])) {
        define("RADIUS_SERVER_PORT_2", $config_yml["radius"][1]["port"]);
    }
    if (!defined("RADIUS_SERVER_SECRET_2") && isset($config_yml["radius"][1]["secret"])) {
        define("RADIUS_SERVER_SECRET_2", $config_yml["radius"][1]["secret"]);
    }
    if (!defined("PROXY_SERVER") && isset($config_yml["proxy"][0]["server"])) {
        define("PROXY_SERVER", $config_yml["proxy"][0]["server"]);
    }
    if (!defined("PROXY_PORT") && isset($config_yml["proxy"][0]["port"])) {
        define("PROXY_PORT", $config_yml["proxy"][0]["port"]);
    }
    if (!defined("PROXY_USER") && isset($config_yml["proxy"][0]["user"])) {
        define("PROXY_USER", $config_yml["proxy"][0]["user"]);
    }
    if (!defined("PROXY_PASSWORD") && isset($config_yml["proxy"][0]["password"])) {
        define("PROXY_PASSWORD", $config_yml["proxy"][0]["password"]);
    }
    if (!defined("MINDISK") && isset($config_yml["mindisk"])) {
        define("MINDISK", $config_yml["mindisk"]);
    }
    if (!defined("TEMPLATE_DISABLED") && isset($config_yml["template_disabled"])) {
        DEFINE("TEMPLATE_DISABLED", "." . $config_yml["template_disabled"]);
    }
    if (!defined("PNET0_BLOCK") && isset($config_yml["pnet0_block"])) {
        DEFINE("PNET0_BLOCK", "." . $config_yml["pnet0_block"]);
    }
    if (!defined("COLOR_SCHEME") && isset($config_yml["color-scheme"])) {
        DEFINE("COLOR_SCHEME", $config_yml["color-scheme"]);
    }
    if (!defined("FONT_SIZE") && isset($config_yml["font_size"])) {
        DEFINE("FONT_SIZE", $config_yml["font_size"]);
    }
    if (!defined("FONT_NAME") && isset($config_yml["font_name"])) {
        DEFINE("FONT_NAME", $config_yml["font_name"]);
    }
    if (!defined("IPV6") && isset($config_yml["ipv6"])) {
        DEFINE("IPV6", $config_yml["ipv6"]);
    }
    if (!defined("VPN_NET") && isset($config_yml["vpn_net"])) {
        DEFINE("VPN_NET", $config_yml["vpn_net"]);
    }
    if (!defined("AD_SERVER_IP") && isset($config_yml["ad_server_ip"])) {
        define("AD_SERVER_IP", $config_yml["ad_server_ip"]);
    }
    if (!defined("AD_SERVER_PORT") && isset($config_yml["ad_server_port"])) {
        define("AD_SERVER_PORT", $config_yml["ad_server_port"]);
    }
    if (!defined("AD_SERVER_TLS") && isset($config_yml["ad_server_tls"])) {
        define("AD_SERVER_TLS", $config_yml["ad_server_tls"]);
    }
    if (!defined("AD_SERVER_DN") && isset($config_yml["ad_server_dn"])) {
        define("AD_SERVER_DN", $config_yml["ad_server_dn"]);
    }
    if (!defined("AD_SERVER_GROUP") && isset($config_yml["ad_server_group"])) {
        define("AD_SERVER_GROUP", $config_yml["ad_server_group"]);
    }
}
$kvm_family = file_get_contents("/opt/unetlab/platform");
$hypervisor = file_get_contents("/opt/unetlab/hypervisor");
if ($hypervisor == "none\n") {
    $hypervisor = "bare";
} else {
    $hypervisor = "vm";
}
$platform = "intel";
if ($kvm_family == "svm") {
    $platform = "amd";
}
if (!defined("MINDISK")) {
    define("MINDISK", 3);
}
if (!defined("DATABASE")) {
    define("DATABASE", "/opt/unetlab/data/database.sdb");
}
if (!defined("FORCE_VM")) {
    define("FORCE_VM", "auto");
}
if (!defined("MODE")) {
    define("MODE", "multi-user");
}
if ((float) phpversion() < 0) {
    if (!defined("SESSION")) {
        define("SESSION", "3660 seconds");
    }
} else if (!defined("SESSION")) {
    define("SESSION", "60");
}
if (!defined("TIMEOUT")) {
    define("TIMEOUT", 25);
}
if (!defined("TEMPLATE_DISABLED")) {
    define("TEMPLATE_DISABLED", ".missing");
}
if (!defined("PNET0_BLOCK")) {
    define("PNET0_BLOCK", 0);
}
if (!defined("RADIUS_SERVER_IP")) {
    define("RADIUS_SERVER_IP", "0.0.0.0");
}
if (!defined("RADIUS_SERVER_PORT")) {
    define("RADIUS_SERVER_PORT", 1812);
}
if (!defined("RADIUS_SERVER_SECRET")) {
    define("RADIUS_SERVER_SECRET", "secret");
}
if (!defined("RADIUS_SERVER_IP_2")) {
    define("RADIUS_SERVER_IP_2", "0.0.0.0");
}
if (!defined("RADIUS_SERVER_PORT_2")) {
    define("RADIUS_SERVER_PORT_2", 1812);
}
if (!defined("RADIUS_SERVER_SECRET_2")) {
    define("RADIUS_SERVER_SECRET_2", "secret");
}
if (!defined("PROXY_SERVER")) {
    define("PROXY_SERVER", "");
}
if (!defined("PROXY_PORT")) {
    define("PROXY_PORT", "");
}
if (!defined("PROXY_USER")) {
    define("PROXY_USER", "");
}
if (!defined("PROXY_PASSWORD")) {
    define("PROXY_PASSWORD", "");
}
if (!defined("COLOR_SCHEME")) {
    define("COLOR_SCHEME", "gray-black");
}
if (!defined("FONT_SIZE")) {
    define("FONT_SIZE", 11);
}
if (!defined("FONT_NAME")) {
    define("FONT_NAME", "monospace");
}
if (!defined("IPV6")) {
    define("IPV6", "0");
}
if (!defined("VPN_NET")) {
    define("VPN_NET", "172.29.130");
}
if (!defined("TPL_DIR")) {
    define("TPL_DIR", "templates/" . $platform);
}
if (!defined("AD_SERVER_IP")) {
    define("AD_SERVER_IP", "0.0.0.0");
}
if (!defined("AD_SERVER_PORT")) {
    define("AD_SERVER_PORT", 389);
}
if (!defined("AD_SERVER_TLS")) {
    define("AD_SERVER_TLS", 0);
}
if (!defined("AD_SERVER_DN")) {
    define("AD_SERVER_DN", "dc=com,dc=example");
}
if (!defined("AD_SERVER_GROUP")) {
    define("AD_SERVER_GROUP", "EVE Users");
}
if (!defined("HYPERVISOR")) {
    define("HYPERVISOR", $hypervisor);
}
$node_templates = [];
$node_config = [];
$node_prep = [];
$node_cstart = [];
foreach (scandir(BASE_DIR . "/html/" . TPL_DIR) as $element) {
    if (is_file(BASE_DIR . "/html/" . TPL_DIR . "/" . $element) && preg_match("/^.+\\.yml\$/", $element)) {
        $cur_name = preg_replace("/.yml/", "", $element);
        $cur_templ = yaml_parse_file(BASE_DIR . "/html/" . TPL_DIR . "/" . $element);
        if (isset($cur_templ["description"])) {
            $node_templates[$cur_name] = $cur_templ["description"];
        }
        if (isset($cur_templ["config_script"])) {
            $node_config[$cur_name] = $cur_templ["config_script"];
        }
        if (isset($cur_templ["prep"])) {
            $node_prep[$cur_name] = $cur_templ["prep"];
        }
        if (isset($cur_templ["cstart"])) {
            $node_cstart[$cur_name] = $cur_templ["cstart"];
        }
    }
}
require_once BASE_DIR . "/html/includes/functions.php";
$qemudir = scandir("/opt/unetlab/addons/qemu/");
$ioldir = scandir("/opt/unetlab/addons/iol/bin/");
$dyndir = scandir("/opt/unetlab/addons/dynamips/");
if (isset($custom_templates)) {
    $node_templates = array_merge($node_templates, $custom_templates);
}
natcasesort($node_templates);
foreach ($node_templates as $templ => $desc) {
    $found = 0;
    if ($templ == "iol") {
        foreach ($ioldir as $dir) {
            if (preg_match("/\\.bin/", $dir) == 1) {
                $found = 1;
            }
        }
    }
    if ($templ == "c1710" || $templ == "c3725" || $templ == "c7200") {
        foreach ($dyndir as $dir) {
            if (preg_match("/" . $templ . "/", $dir) == 1) {
                $found = 1;
            }
        }
    }
    if ($templ == "vpcs" || $templ == "docker") {
        $found = 1;
    }
    if (0 < count(listNodeImages("qemu", $templ))) {
        $found = 1;
    }
    if ($found == 0) {
        $node_templates[$templ] = $desc . TEMPLATE_DISABLED;
    }
}
require_once BASE_DIR . "/html/includes/__interfc.php";
require_once BASE_DIR . "/html/includes/__lab.php";
require_once BASE_DIR . "/html/includes/__task.php";
require_once BASE_DIR . "/html/includes/__network.php";
require_once BASE_DIR . "/html/includes/__node.php";
require_once BASE_DIR . "/html/includes/__textobject.php";
require_once BASE_DIR . "/html/includes/__lineobject.php";
require_once BASE_DIR . "/html/includes/__picture.php";
require_once BASE_DIR . "/html/includes/__configset.php";
require_once BASE_DIR . "/html/includes/messages_en.php";
require_once BASE_DIR . "/html/includes/Parsedown.php";
require_once BASE_DIR . "/html/includes/jscode.php";
if (defined("LOCALE") && is_file(BASE_DIR . "/html/includes/messages_" . LOCALE . ".php")) {
    require_once BASE_DIR . "/html/includes/messages_" . LOCALE . ".php";
}
if (php_sapi_name() == "cli") {
    require_once BASE_DIR . "/html/includes/cli.php";
}

?>
