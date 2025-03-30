package fr.kosmix.spoutify;

import com.getcapacitor.BridgeActivity;
import android.os.Build;
import android.os.Bundle;
import android.view.Display;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import com.getcapacitor.Bridge;

import android.webkit.WebSettings;
import android.webkit.WebView;


public class MainActivity extends BridgeActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Récupérer l'instance du Bridge Capacitor
        Bridge bridge = getBridge();

        // Obtenir la WebView
        WebView webView = bridge.getWebView();

        // Exemple : Activer le mode debug WebView
        webView.getSettings().setRenderPriority(WebSettings.RenderPriority.HIGH);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            // chromium, enable hardware acceleration
            webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        } else {
            // older android version, disable hardware acceleration
            webView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        }
        WebView.setWebContentsDebuggingEnabled(true);
    }
    @Override
    public void onResume() {

        super.onResume();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            Window window = getWindow();
            WindowManager.LayoutParams layoutParams = window.getAttributes();
            layoutParams.preferredDisplayModeId = getHighRefreshRateModeId();
            window.setAttributes(layoutParams);
        }
    }

    private int getHighRefreshRateModeId() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            Display display = getWindowManager().getDefaultDisplay();
            Display.Mode[] modes = display.getSupportedModes();
            for (Display.Mode mode : modes) {
                if (mode.getRefreshRate() == 120f) {
                    return mode.getModeId();
                }
            }
        }
        return 0; // Default mode
    }
}